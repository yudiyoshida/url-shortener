import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Swagger } from './shared/infra/openapi/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Swagger({
    tags: ['Health Check'],
    summary: 'Rota de verificação de saúde da aplicação',
    description: 'Verifica se a aplicação está funcionando corretamente',
  })
  getHealthCheck(): string {
    return this.appService.getHealthCheck();
  }
}
