import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { CreateUrlUseCase } from './create-url.service';

describe('CreateUrlUseCase', () => {
  let sut: CreateUrlUseCase;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockUrlDao: jest.Mocked<UrlDao>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CreateUrlUseCase).compile();

    sut = unit;
    mockConfigService = unitRef.get(ConfigService);
    mockUrlDao = unitRef.get(TOKENS.UrlDao);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should generate a new url if the first one already exists', async() => {
    // Arrange
    const url = createMock<UrlDaoDto>();
    const originalUrl = 'https://teddydigital.io';
    const baseUrl = 'https://short.url';
    mockConfigService.get.mockReturnValue(baseUrl);
    mockUrlDao.findByUrl.mockResolvedValueOnce(url).mockResolvedValue(null);

    // Act
    await sut.execute({ originalUrl });

    // Assert
    expect(mockUrlDao.findByUrl).toHaveBeenCalledTimes(2);
    expect(mockUrlDao.save).toHaveBeenCalledTimes(1);
  });

  it('should save the short url (not logged)', async() => {
    // Arrange
    const originalUrl = 'https://teddydigital.io';
    const baseUrl = 'https://short.url';
    mockConfigService.get.mockReturnValue(baseUrl);

    // Act
    await sut.execute({ originalUrl });

    // Assert
    expect(mockUrlDao.save).toHaveBeenCalledWith(expect.objectContaining({ accountId: undefined }));
  });

  it('should save the short url (logged)', async() => {
    // Arrange
    const originalUrl = 'https://teddydigital.io';
    const baseUrl = 'https://short.url';
    const accountId = 'account-id';
    mockConfigService.get.mockReturnValue(baseUrl);

    // Act
    await sut.execute({ originalUrl }, accountId);

    // Assert
    expect(mockUrlDao.save).toHaveBeenCalledWith(expect.objectContaining({ accountId }));
  });

  it('should return a short url', async() => {
    // Arrange
    const id = 'url-id';
    const originalUrl = 'https://teddydigital.io';
    const baseUrl = 'https://short.url';
    mockConfigService.get.mockReturnValue(baseUrl);
    mockUrlDao.save.mockResolvedValue(id);

    // Act
    const result = await sut.execute({ originalUrl });

    // Assert
    expect(result).toHaveProperty('id', id);
    expect(result).toHaveProperty('shortUrl', expect.stringContaining(baseUrl));
  });
});
