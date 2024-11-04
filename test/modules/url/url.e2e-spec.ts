import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from 'src/modules/account/application/usecases/register/register.service';
import { LoginUseCase } from 'src/modules/authentication/application/usecases/login/login.service';
import { CreateUrlInputDto } from 'src/modules/url/application/usecases/create-url/dto/create-url.dto';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { AppModule } from '../../../src/app.module';

const data: CreateUrlInputDto = {
  originalUrl: 'https://teddydigital.io',
};

/**
 * Não preciso testar retornos ou alterações no banco, pois já testei isso nos arquivos controllers.
 * Aqui eu só testei se as rotas estão funcionando corretamente.
 */
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let register: RegisterUseCase;
  let login: LoginUseCase;
  let database: PrismaService;

  let token: string;

  beforeEach(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    login = moduleFixture.get<LoginUseCase>(LoginUseCase);
    register = moduleFixture.get<RegisterUseCase>(RegisterUseCase);
    database = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async() => {
    await database.account.deleteMany();
    await database.url.deleteMany();

    const data = {
      email: 'jhondoe@gmail.com',
      password: 'abc123456',
    };

    await register.execute({
      ...data,
      name: 'Jhon Doe',
    });

    token = (await login.execute(data)).token;
  });

  describe('List all urls GET /', () => {
    it('should return 200', async() => {
      return request(app.getHttpServer())
        .get('/v1/urls')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Create url POST /', () => {
    it('should return 201 when not logged', () => {
      return request(app.getHttpServer())
        .post('/v1/urls')
        .send(data)
        .expect(201);
    });

    it('should return 201 when logged', async() => {
      return request(app.getHttpServer())
        .post('/v1/urls')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(201);
    });
  });

  describe('Update url PUT /:id', () => {
    it('should return 200', async() => {
      const result = await request(app.getHttpServer())
        .post('/v1/urls')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      return request(app.getHttpServer())
        .patch(`/v1/urls/${result.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(200);
    });
  });

  describe('Delete url DELETE /:id', () => {
    it('should return 200', async() => {
      const result = await request(app.getHttpServer())
        .post('/v1/urls')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      return request(app.getHttpServer())
        .delete(`/v1/urls/${result.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
