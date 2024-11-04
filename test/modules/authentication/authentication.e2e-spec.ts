import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterInputDto } from 'src/modules/account/application/usecases/register/dtos/register.dto';
import { RegisterUseCase } from 'src/modules/account/application/usecases/register/register.service';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { AppModule } from '../../../src/app.module';

describe('Authentication Controller (e2e)', () => {
  let app: INestApplication;
  let database: PrismaService;
  let register: RegisterUseCase;

  beforeEach(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    database = moduleFixture.get<PrismaService>(PrismaService);
    register = moduleFixture.get<RegisterUseCase>(RegisterUseCase);
  });

  it('should login', async() => {
    await database.account.deleteMany({});

    const data: RegisterInputDto = {
      name: 'Teddy',
      email: 'teddy@email.com',
      password: '123456789',
    };

    await register.execute(data);

    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .expect(200)
      .send(data);
  });
});
