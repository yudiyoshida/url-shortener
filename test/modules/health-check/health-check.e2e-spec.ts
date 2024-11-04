import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';

describe('HealthCheck Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return "Hello, World"', () => {
    return request(app.getHttpServer())
      .get('/health-check')
      .expect(200)
      .expect('Hello World!');
  });
});
