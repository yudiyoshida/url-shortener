import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ServerError } from 'src/shared/errors/error.dto';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { ProtectionLevel, SetProtection } from './set-protection.decorator';

export function Protected(level: ProtectionLevel = 'full') {
  return applyDecorators(
    SetProtection(level),
    UseGuards(AuthenticationGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ type: ServerError, description: 'Unauthorized' }),
    ApiForbiddenResponse({ type: ServerError, description: 'Forbidden' }),
  );
}
