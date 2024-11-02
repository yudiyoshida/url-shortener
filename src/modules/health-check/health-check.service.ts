import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  get(): string {
    return 'Hello World!';
  }
}
