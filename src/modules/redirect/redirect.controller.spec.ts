import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { GetUrlUseCase } from '../url/application/usecases/get-url/get-url.service';
import { UrlModule } from '../url/url.module';
import { RedirectController } from './redirect.controller';
import { RedirectModule } from './redirect.module';

describe('RedirectController', () => {
  let sut: RedirectController;
  let getUrl: GetUrlUseCase;
  let database: PrismaService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedirectModule, UrlModule],
    }).compile();

    sut = module.get<RedirectController>(RedirectController);
    getUrl = module.get<GetUrlUseCase>(GetUrlUseCase);
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

  it('should increment the url click count', async() => {
    // Arrange
    const newUrl = await database.url.create({
      data: {
        originalUrl: 'http://www.google.com',
        shortUrl: 'short-url',
        clicks: 0,
      },
    });

    // Act
    await sut.getShortUrl(newUrl.shortUrl, createMock<Response>());

    // Assert
    const getUrlOutput = await getUrl.execute(newUrl.shortUrl);
    expect(getUrlOutput.clicks).toBe(1);
  });

  it('should redirect to original url', async() => {
    // Arrange
    const newUrl = await database.url.create({
      data: {
        originalUrl: 'http://www.google.com',
        shortUrl: 'short-url',
        clicks: 0,
      },
    });
    const mockResponse = createMock<Response>();

    // Act
    await sut.getShortUrl(newUrl.shortUrl, mockResponse);

    // Assert
    expect(mockResponse.redirect).toHaveBeenCalledWith(newUrl.originalUrl);
  });
});
