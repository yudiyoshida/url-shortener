import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlModule } from 'src/modules/url/url.module';
import { Errors } from 'src/shared/errors/messages';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { CreateUrlUseCase } from '../create-url/create-url.service';
import { GetUrlUseCase } from './get-url.service';

describe('GetAllUrlsUseCase', () => {
  let sut: GetUrlUseCase;
  let createUrlUseCase: CreateUrlUseCase;
  let database: PrismaService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UrlModule],
    }).compile();

    sut = module.get<GetUrlUseCase>(GetUrlUseCase);
    createUrlUseCase = module.get<CreateUrlUseCase>(CreateUrlUseCase);
    database = module.get<PrismaService>(PrismaService);

    await database.url.deleteMany({});
  });

  afterAll(async() => {
    await database.url.deleteMany({});
    await database.$disconnect();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw an error if url is not found (different shortUrl)', async() => {
    // Arrange
    const originalUrl = 'https://teddydigital.io';
    await createUrlUseCase.execute({ originalUrl });

    // Act & Assert
    expect.assertions(2);
    return sut.execute('not-found').catch((error) => {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(Errors.URL_NOT_FOUND);
    });
  });

  it('should throw an error if url is not found (case sensitive)', async() => {
    // Arrange
    const originalUrl = 'https://teddydigital.io';
    const createUrlOutput = await createUrlUseCase.execute({ originalUrl });
    const shortUrl = createUrlOutput.shortUrl.split('/').pop();

    // Act & Assert
    expect.assertions(2);
    return sut.execute(shortUrl!.toUpperCase()).catch((error) => {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(Errors.URL_NOT_FOUND);
    });
  });

  it('should return the url', async() => {
    // Arrange
    const originalUrl = 'https://teddydigital.io';
    const createUrlOutput = await createUrlUseCase.execute({ originalUrl });
    const shortUrl = createUrlOutput.shortUrl.split('/').pop();

    // Act
    const url = await sut.execute(shortUrl!);

    // Assert
    expect(url).toHaveProperty('id', createUrlOutput.id);
    expect(url).toHaveProperty('originalUrl', originalUrl);
    expect(url).toHaveProperty('shortUrl', shortUrl);
    expect(url).toHaveProperty('clicks', 0);
    expect(url).toHaveProperty('createdAt', expect.any(Date));
    expect(url).toHaveProperty('updatedAt', expect.any(Date));
  });
});
