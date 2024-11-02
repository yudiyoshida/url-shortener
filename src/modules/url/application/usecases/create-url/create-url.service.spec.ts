import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/modules/url/domain/value-objects/url.vo';
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
    const result = await sut.execute({ originalUrl });

    // Assert
    expect(result).toEqual({ shortUrl: expect.any(String) });
    expect(mockUrlDao.findByUrl).toHaveBeenCalledTimes(2);
    expect(mockUrlDao.save).toHaveBeenCalledTimes(1);
  });

  it('should save the short url', async() => {
    // Arrange
    const originalUrl = 'https://teddydigital.io';
    const baseUrl = 'https://short.url';
    mockConfigService.get.mockReturnValue(baseUrl);

    // Act
    await sut.execute({ originalUrl });

    // Assert
    expect(mockUrlDao.save).toHaveBeenCalledWith(expect.any(Url));
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
    expect(result).toHaveProperty('shortUrl', expect.any(String));
  });
});
