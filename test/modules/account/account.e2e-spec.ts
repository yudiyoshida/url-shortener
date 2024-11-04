import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterInputDto } from 'src/modules/account/application/usecases/register/dtos/register.dto';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { AppModule } from '../../../src/app.module';

describe('Account Controller (e2e)', () => {
  let app: INestApplication;
  let database!: PrismaService;

  beforeEach(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    database = moduleFixture.get<PrismaService>(PrismaService);
  });

  it('create a new account', async() => {
    await database.account.deleteMany({});

    const data: RegisterInputDto = {
      name: 'Teddy',
      email: 'teddy@email.com',
      password: '123456789',
    };

    return request(app.getHttpServer())
      .post('/v1/accounts')
      .send(data)
      .expect(201);
  });
});
