import { Controller, Get, Param } from '@nestjs/common';
import { ReasoningSnapshotService } from './reasoning-snapshot.service';

@Controller('safescope-v2/reasoning-snapshots')
export class ReasoningSnapshotController {
  constructor(private readonly snapshots: ReasoningSnapshotService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snapshots.findOne(id);
  }
}
