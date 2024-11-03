import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Errors } from 'src/shared/errors/messages';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { GetUrlUseCase } from './get-url.service';

describe('GetAllUrlsUseCase', () => {
  let sut: GetUrlUseCase;
  let mockUrlDao: jest.Mocked<UrlDao>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(GetUrlUseCase).compile();

    sut = unit;
    mockUrlDao = unitRef.get(TOKENS.UrlDao);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw an error if the url is not found', async() => {
    // Arrange
    mockUrlDao.findByUrl.mockResolvedValue(null);

    // Act & Assert
    return sut.execute('short-url').catch((error) => {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(Errors.URL_NOT_FOUND);
    });
  });

  it('should return the url if it is found', async() => {
    // Arrange
    const mockUrl = createMock<UrlDaoDto>();
    mockUrlDao.findByUrl.mockResolvedValue(mockUrl);

    // Act
    const result = await sut.execute('short-url');

    // Assert
    expect(result).toBe(mockUrl);
  });
});
