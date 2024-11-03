import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from 'src/modules/account/application/usecases/register/register.service';
import { PayloadDto } from 'src/modules/authentication/dtos/payload.dto';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { UrlModule } from '../../url.module';
import { UrlController } from './url.controller';

describe('UrlController', () => {
  let sut: UrlController;
  let registerUseCase: RegisterUseCase;
  let database: PrismaService;

  let account: PayloadDto;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UrlModule],
    }).compile();

    sut = module.get<UrlController>(UrlController);
    registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);
    database = module.get<PrismaService>(PrismaService);

    await database.url.deleteMany({});
  });

  beforeEach(async() => {
    await database.account.deleteMany({});
    const result = await registerUseCase.execute({
      name: 'Teddy',
      email: 'teddy@email.com',
      password: '123456789',
    });

    account = { sub: result.id };
  });

  afterAll(async() => {
    await database.account.deleteMany({});
    await database.url.deleteMany({});
    await database.$disconnect();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('POST /urls', () => {
    it('should create a new url (not logged)', async() => {
      // Arrange
      const originalUrl = 'https://teddydigital.io';

      // Act
      const createOutput = await sut.createUrl({ originalUrl }, {} as any);

      // Assert
      const url = await database.url.findUnique({ where: { id: createOutput.id } });
      expect(url).toHaveProperty('id', createOutput.id);
      expect(url).toHaveProperty('originalUrl', originalUrl);
      expect(createOutput.shortUrl).toContain(url?.shortUrl);
      expect(url).toHaveProperty('clicks', 0);
      expect(url).toHaveProperty('createdAt', expect.any(Date));
      expect(url).toHaveProperty('updatedAt', expect.any(Date));
      expect(url).toHaveProperty('accountId', null);
    });

    it('should create a new url (logged)', async() => {
      // Arrange
      const originalUrl = 'https://teddydigital.io';

      // Act
      const createOutput = await sut.createUrl({ originalUrl }, account);

      // Assert
      const getAllOutput = await sut.getAllUrls({ }, account);
      expect(getAllOutput.data.length).toBe(1);
      expect(getAllOutput.data[0]).toHaveProperty('id', createOutput.id);
      expect(getAllOutput.data[0]).toHaveProperty('originalUrl', originalUrl);
      expect(getAllOutput.data[0]).toHaveProperty('shortUrl', createOutput.shortUrl);
      expect(getAllOutput.data[0]).toHaveProperty('accountId', account.sub);
    });
  });

  describe('GET /urls', () => {
    it('should not return deletedAt information', async() => {
      // Arrange
      const originalUrl = 'https://teddydigital.io';
      await sut.createUrl({ originalUrl }, account);

      // Act
      const getAllOutput = await sut.getAllUrls({}, account);

      // Assert
      expect(getAllOutput.data.length).toBe(1);
      expect(getAllOutput.data[0]).not.toHaveProperty('deletedAt');
    });
  });

  describe('PATCH /urls/{id}', () => {
    it('should update the url', async() => {
      // Arrange
      const originalUrl = 'https://teddydigital.io';
      const createOutput = await sut.createUrl({ originalUrl }, account);

      const newUrl = 'https://teddydigital.com';

      // Act
      const updateOutput = await sut.updateUrl({ id: createOutput.id }, account, { newUrl });

      // Assert
      expect(updateOutput).toEqual({ message: 'Url atualizada com sucesso.' });

      const getAllOutput = await sut.getAllUrls({}, account);
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
      const createOutput = await sut.createUrl({ originalUrl }, account);
      expect((await sut.getAllUrls({}, account)).data.length).toBe(1);

      // Act
      const deleteOutput = await sut.deleteUrl({ id: createOutput.id }, account);

      // Assert
      expect(deleteOutput).toEqual({ message: 'Url deletada com sucesso.' });

      const getAllOutput = await sut.getAllUrls({}, account);
      expect(getAllOutput.data.length).toBe(0);
    });
  });
});
