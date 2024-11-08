import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UrlDaoDto } from 'src/modules/url/application/persistence/dao/url-dao.dto';
import { UrlDao, UrlSaveDto } from 'src/modules/url/application/persistence/dao/url-dao.interface';
import { PrismaService } from 'src/shared/infra/database/prisma.service';

const urlSelect = {
  id: true,
  originalUrl: true,
  shortUrl: true,
  clicks: true,
  accountId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: false,
} satisfies Prisma.UrlSelect;

@Injectable()
export class UrlPrismaAdapterDao implements UrlDao {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(accountId: string, page?: number, size?: number): Promise<[UrlDaoDto[], number]> {
    const where: Prisma.UrlWhereInput = {
      deletedAt: null,
      accountId,
    };

    return this.prisma.$transaction([
      this.prisma.url.findMany({
        where,
        skip: (page && size) ? ((page - 1) * size) : undefined,
        take: (page && size) ? size : undefined,
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

  public async save(data: UrlSaveDto): Promise<string> {
    const newUrl = await this.prisma.url.create({
      data,
    });

    return newUrl.id;
  }

  public async update(id: string, newOriginalUrl: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { originalUrl: newOriginalUrl },
    });
  }

  public async incrementClick(shortUrl: string): Promise<void> {
    await this.prisma.url.update({
      where: { shortUrl },
      data: {
        clicks: { increment: 1 },
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
