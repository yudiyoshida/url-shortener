import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { UrlDaoDto } from '../url/application/persistence/dao/url-dao.dto';
import { GetUrlUseCase } from '../url/application/usecases/get-url/get-url.service';
import { RedirectService } from './redirect.service';

describe('RedirectService', () => {
  let sut: RedirectService;
  let mockGetUrlUseCase: jest.Mocked<GetUrlUseCase>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RedirectService).compile();

    sut = unit;
    mockGetUrlUseCase = unitRef.get(GetUrlUseCase);
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
});
