import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from 'src/modules/account/application/usecases/register/register.service';
import { Errors } from 'src/shared/errors/messages';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { LoginInputDto } from '../../application/usecases/login/dtos/login.dto';
import { AuthenticationModule } from '../../authentication.module';
import { AuthenticationController } from './authentication.controller';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let registerUseCase: RegisterUseCase;
  let database: PrismaService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationModule],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);
    database = module.get<PrismaService>(PrismaService);

    await database.account.deleteMany({});
  });

  afterAll(async() => {
    await database.account.deleteMany({});
    await database.$disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw an error when credentials are invalid', async() => {
    // Arrange
    const data: LoginInputDto = {
      email: 'janedoe@email.com',
      password: '123456789',
    };

    // Act & Assert
    expect.assertions(2);
    return controller.login(data).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(Errors.INVALID_CREDENTIALS);
    });
  });

  it('should return an access token when credentials are valid', async() => {
    // Arrange
    const data: LoginInputDto = {
      email: 'janedoe@email.com',
      password: '123456789',
    };
    await registerUseCase.execute({
      name: 'Jane Doe',
      email: data.email,
      password: data.password,
    });

    // Act
    const result = await controller.login(data);

    // Assert
    expect(result).toHaveProperty('token', expect.any(String));
  });
});
