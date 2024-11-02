import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().positive().integer().required(),
      }),
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
