import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UrlDaoDto } from '../url/application/persistence/dao/url-dao.dto';
import { GetUrlUseCase } from '../url/application/usecases/get-url/get-url.service';
import { IncrementClickUseCase } from '../url/application/usecases/increment-click/increment-click.service';
import { RedirectService } from './redirect.service';

describe('RedirectService', () => {
  let sut: RedirectService;
  let mockGetUrlUseCase: jest.Mocked<GetUrlUseCase>;
  let mockIncrementClickUseCase: jest.Mocked<IncrementClickUseCase>;
  let mockCacheManager: jest.Mocked<Cache>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RedirectService).compile();

    sut = unit;
    mockGetUrlUseCase = unitRef.get(GetUrlUseCase);
    mockIncrementClickUseCase = unitRef.get(IncrementClickUseCase);
    mockCacheManager = unitRef.get(CACHE_MANAGER);
  });

  it('should get the originalUrl from the database', async() => {
    // Arrange
    const shortUrl = 'short-url';
    const mockUrl = createMock<UrlDaoDto>();
    mockCacheManager.get.mockResolvedValue(null);
    mockGetUrlUseCase.execute.mockResolvedValue(mockUrl);

    // Act
    const result = await sut.execute(shortUrl);

    // Assert
    expect(result).toBe(mockUrl.originalUrl);
    expect(mockCacheManager.get).toHaveBeenNthCalledWith(1, shortUrl);
    expect(mockGetUrlUseCase.execute).toHaveBeenNthCalledWith(1, shortUrl);
    expect(mockCacheManager.set).toHaveBeenNthCalledWith(1, shortUrl, mockUrl.originalUrl);
    expect(mockIncrementClickUseCase.execute).toHaveBeenNthCalledWith(1, shortUrl);
  });

  it('should get the originalUrl from the cache', async() => {
    // Arrange
    const shortUrl = 'short-url';
    const mockUrl = createMock<UrlDaoDto>();
    mockCacheManager.get.mockResolvedValue(mockUrl.originalUrl);

    // Act
    const result = await sut.execute(shortUrl);

    // Assert
    expect(result).toBe(mockUrl.originalUrl);
    expect(mockCacheManager.get).toHaveBeenNthCalledWith(1, shortUrl);
    expect(mockGetUrlUseCase.execute).not.toHaveBeenCalled();
    expect(mockCacheManager.set).not.toHaveBeenCalled();
    expect(mockIncrementClickUseCase.execute).toHaveBeenNthCalledWith(1, shortUrl);
  });
});
