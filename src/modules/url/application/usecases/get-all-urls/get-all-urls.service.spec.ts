import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { GetAllUrlsUseCase } from './get-all-urls.service';

describe('GetAllUrlsUseCase', () => {
  let sut: GetAllUrlsUseCase;
  let mockUrlDao: jest.Mocked<UrlDao>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(GetAllUrlsUseCase).compile();

    sut = unit;
    mockUrlDao = unitRef.get(TOKENS.UrlDao);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return an array of urls within the pagination dto when providing page and size', async() => {
    // Arrange
    const data = createMock<UrlDaoDto[]>();
    mockUrlDao.findAll.mockResolvedValue([data, 1]);

    // Act
    const result = await sut.execute('accountId', 1, 10);

    // Assert
    expect(result).toHaveProperty('currentPage');
    expect(result).toHaveProperty('itemsPerPage');
    expect(result).toHaveProperty('totalItems');
    expect(result).toHaveProperty('totalPages');
    expect(result).toHaveProperty('data');
  });

  it('should return an array of urls within the pagination dto when not providing page and size', async() => {
    // Arrange
    const data = createMock<UrlDaoDto[]>();
    mockUrlDao.findAll.mockResolvedValue([data, 1]);

    // Act
    const result = await sut.execute('accountId');

    // Assert
    expect(result).toHaveProperty('currentPage');
    expect(result).toHaveProperty('itemsPerPage');
    expect(result).toHaveProperty('totalItems');
    expect(result).toHaveProperty('totalPages');
    expect(result).toHaveProperty('data');
  });
});
