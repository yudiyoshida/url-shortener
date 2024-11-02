import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { AccountModule } from '../../account.module';
import { RegisterInputDto } from '../../application/usecases/register/dtos/register.dto';
import { AccountController } from './account.controller';

describe('AccountController', () => {
  let controller: AccountController;
  let database: PrismaService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountModule],
    }).compile();

    controller = module.get<AccountController>(AccountController);
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

  it('should create a new account', async() => {
    // Arrange
    const data: RegisterInputDto = {
      name: 'Jhon Doe',
      email: 'jhondoe@email.com',
      password: '123456789',
    };

    // Act
    const result = await controller.register(data);

    // Assert
    expect(result).toHaveProperty('id', expect.any(String));

    // TODO: subtituir por um caso de uso que puxa a conta do banco
    const account = await database.account.findUnique({
      where: { id: result.id },
    });

    expect(account).toHaveProperty('id', result.id);
    expect(account).toHaveProperty('name', data.name);
    expect(account).toHaveProperty('email', data.email);
    expect(account).toHaveProperty('password', expect.any(String));
    expect(account).toHaveProperty('createdAt', expect.any(Date));
    expect(account).toHaveProperty('updatedAt', expect.any(Date));
  });
});
