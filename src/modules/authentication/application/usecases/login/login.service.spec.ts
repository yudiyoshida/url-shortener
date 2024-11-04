import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountDaoDto } from 'src/modules/account/application/persistence/dao/account-dao.dto';
import { FindAccountByEmailUseCase } from 'src/modules/account/application/usecases/find-account-by-email/find-account-by-email.service';
import { Password } from 'src/modules/account/domain/value-objects/password.vo';
import { Errors } from 'src/shared/errors/messages';
import { LoginInputDto } from './dtos/login.dto';
import { LoginUseCase } from './login.service';

describe('LoginService', () => {
  let sut: LoginUseCase;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockFindAccountByEmailUseCase: jest.Mocked<FindAccountByEmailUseCase>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(LoginUseCase).compile();

    sut = unit;
    mockJwtService = unitRef.get(JwtService);
    mockFindAccountByEmailUseCase = unitRef.get(FindAccountByEmailUseCase);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw an error if account is not found', async() => {
    // Arrange
    const data = createMock<LoginInputDto>();
    mockFindAccountByEmailUseCase.execute.mockResolvedValue(null);

    // Act & Assert
    expect.assertions(2);
    return sut.execute(data).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(Errors.INVALID_CREDENTIALS);
    });
  });

  it('should throw an error if password does not match', async() => {
    // Arrange
    const data = createMock<LoginInputDto>({ password: 'password' });
    const account = createMock<AccountDaoDto>({ password: 'hashed_password' });
    const mockPassword = createMock<typeof Password>();

    mockFindAccountByEmailUseCase.execute.mockResolvedValue(account);
    mockPassword.compare.mockReturnValue(false);

    // Act & Assert
    expect.assertions(2);
    return sut.execute(data).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(Errors.INVALID_CREDENTIALS);
    });
  });

  it('should return a token if password matches', async() => {
    // Arrange
    const password = 'password';
    const hashedPassword = new Password(password).value;

    const data = createMock<LoginInputDto>({ password });
    const account = createMock<AccountDaoDto>({ password: hashedPassword });
    const mockPassword = createMock<typeof Password>();

    mockFindAccountByEmailUseCase.execute.mockResolvedValue(account);
    mockPassword.compare.mockReturnValue(true);
    mockJwtService.sign.mockReturnValue('token');

    // Act
    const result = await sut.execute(data);

    // Assert
    expect(result).toEqual({ token: 'token' });
    expect(mockJwtService.sign).toHaveBeenCalled();
  });
});
