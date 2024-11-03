import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './redirect.controller';
import { RedirectModule } from './redirect.module';

describe('RedirectController', () => {
  let controller: RedirectController;

  beforeEach(async() => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [RedirectModule],
    }).compile();

    controller = app.get<RedirectController>(RedirectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
