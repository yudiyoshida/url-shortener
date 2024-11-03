import { Test, TestingModule } from '@nestjs/testing';
import { UrlModule } from 'src/modules/url/url.module';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { IncrementClickUseCase } from './increment-click.service';

describe('IncrementClickUseCase', () => {
  let sut: IncrementClickUseCase;
  let database: PrismaService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UrlModule],
    }).compile();

    sut = module.get<IncrementClickUseCase>(IncrementClickUseCase);
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

  it('should increment click', async() => {
    const url = await database.url.create({
      data: {
        originalUrl: 'https://www.google.com',
        shortUrl: 'google',
        clicks: 0,
      },
    });

    await sut.execute(url.shortUrl);

    const updatedUrl = await database.url.findUnique({
      where: { shortUrl: url.shortUrl },
    });

    expect(updatedUrl?.clicks).toBe(1);
  });
});
