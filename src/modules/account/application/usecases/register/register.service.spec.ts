import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { ConflictException } from '@nestjs/common';
import { Errors } from 'src/shared/errors/messages';
import { TOKENS } from 'src/shared/ioc/tokens';
import { AccountDaoDto } from '../../persistence/dao/account-dao.dto';
import { AccountDao } from '../../persistence/dao/account-dao.interface';
import { RegisterInputDto } from './dtos/register.dto';
import { RegisterUseCase } from './register.service';

describe('RegisterUseCase', () => {
  let sut: RegisterUseCase;
  let mockAccountDao: jest.Mocked<AccountDao>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RegisterUseCase).compile();

    sut = unit;
    mockAccountDao = unitRef.get(TOKENS.AccountDao);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw an error if emails already exists', async() => {
    // Arrange
    const mockAccount = createMock<AccountDaoDto>();
    const data = createMock<RegisterInputDto>();
    mockAccountDao.findByEmail.mockResolvedValue(mockAccount);

    // Act & Assert
    expect.assertions(2);
    return sut.execute(data).catch((error) => {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe(Errors.EMAIL_ALREADY_EXISTS);
    });
  });

  it('should save an account', async() => {
    // Arrange
    const data = createMock<RegisterInputDto>({ password: 'password' });
    const accountId = 'account-id';
    mockAccountDao.findByEmail.mockResolvedValue(null);
    mockAccountDao.save.mockResolvedValue(accountId);

    // Act
    const result = await sut.execute(data);

    // Assert
    expect(result).toEqual({ id: accountId });
    expect(mockAccountDao.save).toHaveBeenCalledTimes(1);
  });
});
