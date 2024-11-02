import { Injectable } from '@nestjs/common';
import { UrlDaoDto } from 'src/modules/url/application/persistence/dao/url-dao.dto';
import { UrlDao } from 'src/modules/url/application/persistence/dao/url-dao.interface';
import { Url } from 'src/modules/url/domain/value-objects/url.vo';
import { PrismaService } from 'src/shared/infra/database/prisma.service';

@Injectable()
export class UrlPrismaAdapterDao implements UrlDao {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<UrlDaoDto[]> {
    return this.prisma.url.findMany({
      where: { deletedAt: null },
    });
  }

  public async findById(id: string): Promise<UrlDaoDto | null> {
    return this.prisma.url.findUnique({
      where: { id, deletedAt: null },
    });
  }

  public async findByUrl(url: string): Promise<UrlDaoDto | null> {
    return this.prisma.url.findUnique({
      where: { shortUrl: url, deletedAt: null },
    });
  }

  public async save(url: Url): Promise<string> {
    const newUrl = await this.prisma.url.create({
      data: {
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        clicks: 0,
      },
    });

    return newUrl.id;
  }

  public async update(id: string, newOriginalUrl: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { originalUrl: newOriginalUrl },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
