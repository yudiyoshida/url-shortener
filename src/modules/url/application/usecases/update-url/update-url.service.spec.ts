import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { UpdateUrlUseCase } from './update-url.service';

describe('UpdateUrlUseCase', () => {
  let sut: UpdateUrlUseCase;
  let mockUrlDao: jest.Mocked<UrlDao>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UpdateUrlUseCase).compile();

    sut = unit;
    mockUrlDao = unitRef.get(TOKENS.UrlDao);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw an error if url is not found', async() => {
    // Arrange
    const url = 'https://teddydigital.io';
    const newUrl = 'https://google.com';
    mockUrlDao.findById.mockResolvedValue(null);

    // Act & Assert
    expect.assertions(2);
    return sut.execute(url, { newUrl }).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Url não encontrada na base de dados.');
    });
  });

  it('should update the url and return a success message', async() => {
    // Arrange
    const id = 'url-id';
    const newUrl = 'https://google.com';
    const mockUrl = createMock<UrlDaoDto>();
    mockUrlDao.findById.mockResolvedValue(mockUrl);

    // Act
    const result = await sut.execute(id, { newUrl });

    // Assert
    expect(mockUrlDao.findById).toHaveBeenNthCalledWith(1, id);
    expect(mockUrlDao.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Url atualizada com sucesso.' });
  });
});
