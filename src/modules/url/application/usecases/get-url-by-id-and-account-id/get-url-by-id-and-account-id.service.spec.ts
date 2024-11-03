import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Errors } from 'src/shared/errors/messages';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { GetUrlByIdAndAccountIdUseCase } from './get-url-by-id-and-account-id.service';

describe('GetUrlByIdAndAccountIdUseCase', () => {
  let sut: GetUrlByIdAndAccountIdUseCase;
  let mockUrlDao: jest.Mocked<UrlDao>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(GetUrlByIdAndAccountIdUseCase).compile();

    sut = unit;
    mockUrlDao = unitRef.get(TOKENS.UrlDao);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw an error if the url is not found', async() => {
    // Arrange
    mockUrlDao.findById.mockResolvedValue(null);

    // Act & Assert
    return sut.execute('url-id', 'acc-id').catch((error) => {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(Errors.URL_NOT_FOUND);
    });
  });

  it('should throw an error if the url is not from the account', async() => {
    // Arrange
    const mockUrl = createMock<UrlDaoDto>({ accountId: 'another-acc-id' });
    mockUrlDao.findById.mockResolvedValue(mockUrl);

    // Act & Assert
    return sut.execute('url-id', 'acc-id').catch((error) => {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(Errors.URL_NOT_FOUND);
    });
  });

  it('should return the url if it is found and belongs to acocunt', async() => {
    // Arrange
    const mockUrl = createMock<UrlDaoDto>({ accountId: 'acc-id' });
    mockUrlDao.findById.mockResolvedValue(mockUrl);

    // Act
    const result = await sut.execute('short-url', 'acc-id');

    // Assert
    expect(result).toBe(mockUrl);
  });
});
