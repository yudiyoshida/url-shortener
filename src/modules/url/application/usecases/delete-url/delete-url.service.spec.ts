import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { GetUrlByIdAndAccountIdUseCase } from '../get-url-by-id-and-account-id/get-url-by-id-and-account-id.service';
import { DeleteUrlUseCase } from './delete-url.service';

describe('DeleteUrlUseCase', () => {
  let sut: DeleteUrlUseCase;
  let mockUrlDao: jest.Mocked<UrlDao>;
  let mockGetUrlByIdAndAccountIdUseCase: jest.Mocked<GetUrlByIdAndAccountIdUseCase>;
  let mockCacheManager: jest.Mocked<Cache>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(DeleteUrlUseCase).compile();

    sut = unit;
    mockUrlDao = unitRef.get(TOKENS.UrlDao);
    mockGetUrlByIdAndAccountIdUseCase = unitRef.get(GetUrlByIdAndAccountIdUseCase);
    mockCacheManager = unitRef.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should delete url, return success message and delete cache', async() => {
    // Arrange
    const id = 'url-id';
    const accountId = 'account-id';
    const mockUrl = createMock<UrlDaoDto>();
    mockGetUrlByIdAndAccountIdUseCase.execute.mockResolvedValue(mockUrl);

    // Act
    const result = await sut.execute(id, accountId);

    // Assert
    expect(result).toEqual({ message: 'Url deletada com sucesso.' });
    expect(mockGetUrlByIdAndAccountIdUseCase.execute).toHaveBeenCalledWith(id, accountId);
    expect(mockUrlDao.delete).toHaveBeenCalledWith(mockUrl.id);
    expect(mockCacheManager.del).toHaveBeenNthCalledWith(1, mockUrl.shortUrl);
  });
});
