import { Controller, Get } from '@nestjs/common';
import { Swagger } from 'src/shared/infra/openapi/swagger';
import { HealthCheckService } from './health-check.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  @Swagger({
    tags: ['Health Check'],
    summary: 'Rota de verificação de saúde da aplicação',
    description: 'Verifica se a aplicação está funcionando corretamente',
  })
  getHealthCheck(): string {
    return this.healthCheckService.get();
  }
}
