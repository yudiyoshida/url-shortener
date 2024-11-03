import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from './health-check.service';

describe('HealthCheckController', () => {
  let sut: HealthCheckController;

  beforeEach(async() => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [HealthCheckService],
    }).compile();

    sut = app.get<HealthCheckController>(HealthCheckController);
  });

  it('should return "Hello World!"', () => {
    expect(sut.getHealthCheck()).toBe('Hello World!');
  });
});
