import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CacheModule.register({
      ttl: 0,
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
