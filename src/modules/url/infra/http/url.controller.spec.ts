import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { UrlModule } from '../../url.module';
import { UrlController } from './url.controller';

describe('UrlController', () => {
  let controller: UrlController;
  let database: PrismaService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UrlModule],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    database = module.get<PrismaService>(PrismaService);

    await database.url.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /urls', () => {
    it('should create a new url', async() => {
      // Arrange
      const originalUrl = 'https://teddydigital.io';

      // Act
      const createOutput = await controller.createUrl({ originalUrl });

      // Assert
      expect(createOutput).toEqual({ shortUrl: expect.any(String) });

      const getAllOutput = await controller.getAllUrls();
      expect(getAllOutput.length).toBe(1);
      expect(getAllOutput[0]).toHaveProperty('id', expect.any(String));
      expect(getAllOutput[0]).toHaveProperty('originalUrl', originalUrl);
      expect(getAllOutput[0]).toHaveProperty('shortUrl', createOutput.shortUrl);
      expect(getAllOutput[0]).toHaveProperty('clicks', 0);
      expect(getAllOutput[0]).toHaveProperty('createdAt', expect.any(Date));
      expect(getAllOutput[0]).toHaveProperty('updatedAt', expect.any(Date));
    });
  });
});
