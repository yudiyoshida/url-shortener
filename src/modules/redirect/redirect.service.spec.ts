import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { UrlDaoDto } from '../url/application/persistence/dao/url-dao.dto';
import { GetUrlUseCase } from '../url/application/usecases/get-url/get-url.service';
import { IncrementClickUseCase } from '../url/application/usecases/increment-click/increment-click.service';
import { RedirectService } from './redirect.service';

describe('RedirectService', () => {
  let sut: RedirectService;
  let mockGetUrlUseCase: jest.Mocked<GetUrlUseCase>;
  let mockIncrementClickUseCase: jest.Mocked<IncrementClickUseCase>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RedirectService).compile();

    sut = unit;
    mockGetUrlUseCase = unitRef.get(GetUrlUseCase);
    mockIncrementClickUseCase = unitRef.get(IncrementClickUseCase);
  });


  it('should return the original URL', async() => {
    // Arrange
    const mockUrl = createMock<UrlDaoDto>();
    mockGetUrlUseCase.execute.mockResolvedValue(mockUrl);

    // Act
    const result = await sut.execute('short-url');

    // Assert
    expect(result).toBe(mockUrl.originalUrl);
  });

  it('should increment the click count', async() => {
    // Arrange
    const mockUrl = createMock<UrlDaoDto>();
    mockGetUrlUseCase.execute.mockResolvedValue(mockUrl);

    // Act
    await sut.execute('short-url');

    // Assert
    expect(mockIncrementClickUseCase.execute).toHaveBeenCalledWith(mockUrl.shortUrl);
  });
});
