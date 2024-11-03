import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { GetUrlByIdAndAccountIdUseCase } from '../get-url-by-id-and-account-id/get-url-by-id-and-account-id.service';
import { UpdateUrlUseCase } from './update-url.service';

describe('UpdateUrlUseCase', () => {
  let sut: UpdateUrlUseCase;
  let mockUrlDao: jest.Mocked<UrlDao>;
  let mockGetUrlByIdAndAccountIdUseCase: jest.Mocked<GetUrlByIdAndAccountIdUseCase>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UpdateUrlUseCase).compile();

    sut = unit;
    mockUrlDao = unitRef.get(TOKENS.UrlDao);
    mockGetUrlByIdAndAccountIdUseCase = unitRef.get(GetUrlByIdAndAccountIdUseCase);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should update the url and return a success message', async() => {
    // Arrange
    const id = 'url-id';
    const newUrl = 'https://google.com';
    const accountId = 'account-id';
    const mockUrl = createMock<UrlDaoDto>({ accountId });
    mockGetUrlByIdAndAccountIdUseCase.execute.mockResolvedValue(mockUrl);

    // Act
    const result = await sut.execute(id, accountId, { newUrl });

    // Assert
    expect(mockGetUrlByIdAndAccountIdUseCase.execute).toHaveBeenNthCalledWith(1, id, accountId);
    expect(mockUrlDao.update).toHaveBeenNthCalledWith(1, mockUrl.id, newUrl);
    expect(result).toEqual({ message: 'Url atualizada com sucesso.' });
  });
});
