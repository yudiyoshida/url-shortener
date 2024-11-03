import { SetMetadata } from '@nestjs/common';

export type ProtectionLevel = 'full' | 'partial';

export const PROTECTION_KEY = 'PROTECTION_KEY';
export const SetProtection = (level: ProtectionLevel) => SetMetadata(PROTECTION_KEY, level);
