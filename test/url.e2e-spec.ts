import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUrlInputDto } from 'src/modules/url/application/usecases/create-url/dto/create-url.dto';
import { AppModule } from '../src/app.module';

const data: CreateUrlInputDto = {
  originalUrl: 'https://teddydigital.io',
};

/**
 * Não preciso testar retornos ou alterações no banco, pois já testei isso nos arquivos controllers.
 * Aqui eu só testei se as rotas estão funcionando corretamente.
 */
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  let token: string;

  beforeEach(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    token = jwtService.sign({ sub: '123' });
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
