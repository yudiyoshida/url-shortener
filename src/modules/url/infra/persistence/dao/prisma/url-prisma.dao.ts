import { Injectable } from '@nestjs/common';
import { UrlDaoDto } from 'src/modules/url/application/persistence/dao/url-dao.dto';
import { UrlDao } from 'src/modules/url/application/persistence/dao/url-dao.interface';
import { Url } from 'src/modules/url/domain/value-objects/url.vo';
import { PrismaService } from 'src/shared/infra/database/prisma.service';

@Injectable()
export class UrlPrismaAdapterDao implements UrlDao {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<UrlDaoDto[]> {
    return this.prisma.url.findMany();
  }

  public async findByUrl(url: string): Promise<UrlDaoDto | null> {
    return this.prisma.url.findUnique({
      where: { shortUrl: url },
    });
  }

  public async save(url: Url): Promise<void> {
    await this.prisma.url.create({
      data: {
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        clicks: 0,
      },
    });
  }
}
