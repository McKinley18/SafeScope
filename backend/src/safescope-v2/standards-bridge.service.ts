import { Injectable } from '@nestjs/common';
import { STANDARDS_MAPPING } from './standards-mapping.seed';

@Injectable()
export class StandardsBridgeService {
  getSuggestedStandards(classification: string) {
    return STANDARDS_MAPPING[classification] || [];
  }
}
