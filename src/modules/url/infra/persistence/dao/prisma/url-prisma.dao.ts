import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UrlDaoDto } from 'src/modules/url/application/persistence/dao/url-dao.dto';
import { UrlDao } from 'src/modules/url/application/persistence/dao/url-dao.interface';
import { Url } from 'src/modules/url/domain/value-objects/url.vo';
import { PrismaService } from 'src/shared/infra/database/prisma.service';

const urlSelect = {
  id: true,
  originalUrl: true,
  shortUrl: true,
  clicks: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: false,
} satisfies Prisma.UrlSelect;

@Injectable()
export class UrlPrismaAdapterDao implements UrlDao {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<[UrlDaoDto[], number]> {
    const where: Prisma.UrlWhereInput = { deletedAt: null };

    return this.prisma.$transaction([
      this.prisma.url.findMany({
        where,
        select: urlSelect,
      }),
      this.prisma.url.count({ where }),
    ]);
  }

  public async findById(id: string): Promise<UrlDaoDto | null> {
    return this.prisma.url.findUnique({
      where: { id, deletedAt: null },
      select: urlSelect,
    });
  }

  public async findByUrl(url: string): Promise<UrlDaoDto | null> {
    return this.prisma.url.findUnique({
      where: { shortUrl: url, deletedAt: null },
      select: urlSelect,
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
