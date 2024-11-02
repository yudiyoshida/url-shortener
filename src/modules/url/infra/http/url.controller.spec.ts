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

  afterAll(async() => {
    await database.url.deleteMany({});
    await database.$disconnect();
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
      const getAllOutput = await controller.getAllUrls();
      expect(getAllOutput.data.length).toBe(1);
      expect(getAllOutput.data[0]).toHaveProperty('id', createOutput.id);
      expect(getAllOutput.data[0]).toHaveProperty('originalUrl', originalUrl);
      expect(getAllOutput.data[0]).toHaveProperty('shortUrl', createOutput.shortUrl);
      expect(getAllOutput.data[0]).toHaveProperty('clicks', 0);
      expect(getAllOutput.data[0]).toHaveProperty('createdAt', expect.any(Date));
      expect(getAllOutput.data[0]).toHaveProperty('updatedAt', expect.any(Date));
    });
  });

  describe('GET /urls', () => {
    it('should not return deletedAt information', async() => {
      // Arrange
      const originalUrl = 'https://teddydigital.io';
      await controller.createUrl({ originalUrl });

      // Act
      const getAllOutput = await controller.getAllUrls();

      // Assert
      expect(getAllOutput.data.length).toBe(1);
      expect(getAllOutput.data[0]).not.toHaveProperty('deletedAt');
    });
  });

  describe('PATCH /urls/{id}', () => {
    it('should update the url', async() => {
      // Arrange
      const originalUrl = 'https://teddydigital.io';
      const createOutput = await controller.createUrl({ originalUrl });

      const newUrl = 'https://teddydigital.com';

      // Act
      const updateOutput = await controller.updateUrl({ id: createOutput.id }, { newUrl });

      // Assert
      expect(updateOutput).toEqual({ message: 'Url atualizada com sucesso.' });

      const getAllOutput = await controller.getAllUrls();
      expect(getAllOutput.data.length).toBe(1);
      expect(getAllOutput.data[0]).toHaveProperty('id', createOutput.id);
      expect(getAllOutput.data[0]).toHaveProperty('originalUrl', newUrl);
      expect(getAllOutput.data[0]).toHaveProperty('shortUrl', createOutput.shortUrl);
    });
  });

  describe('DELETE /urls/{id}', () => {
    it('should delete the url', async() => {
      // Arrange
      const originalUrl = 'https://teddydigital.io';
      const createOutput = await controller.createUrl({ originalUrl });
      expect((await controller.getAllUrls()).data.length).toBe(1);

      // Act
      const deleteOutput = await controller.deleteUrl({ id: createOutput.id });

      // Assert
      expect(deleteOutput).toEqual({ message: 'Url deletada com sucesso.' });

      const getAllOutput = await controller.getAllUrls();
      expect(getAllOutput.data.length).toBe(0);
    });
  });
});
