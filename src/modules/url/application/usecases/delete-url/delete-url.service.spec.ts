import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { DeleteUrlUseCase } from './delete-url.service';

describe('DeleteUrlUseCase', () => {
  let sut: DeleteUrlUseCase;
  let mockUrlDao: jest.Mocked<UrlDao>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(DeleteUrlUseCase).compile();

    sut = unit;
    mockUrlDao = unitRef.get(TOKENS.UrlDao);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw an error if url is not found', async() => {
    // Arrange
    const id = 'url-id';
    mockUrlDao.findById.mockResolvedValue(null);

    // Act & Assert
    expect.assertions(2);
    return sut.execute(id).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Url não encontrada na base de dados.');
    });
  });

  it('should delete url and return success message', async() => {
    // Arrange
    const id = 'url-id';
    const mockUrl = createMock<UrlDaoDto>();
    mockUrlDao.findById.mockResolvedValue(mockUrl);

    // Act
    const result = await sut.execute(id);

    // Assert
    expect(result).toEqual({ message: 'Url deletada com sucesso.' });
    expect(mockUrlDao.delete).toHaveBeenCalledWith(id);
  });
});
