import { Controller, Get, Post, Body, Param, Patch , Query} from '@nestjs/common';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CreateCorrectiveActionDto, CloseCorrectiveActionDto } from './dto/corrective-action.dto';

@Controller('actions')
export class CorrectiveActionsController {
  constructor(private readonly service: CorrectiveActionsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('statusCode') statusCode?: string,
    @Query('priorityCode') priorityCode?: string,
  ) {
    return this.service.findAll({ page, limit, statusCode, priorityCode });
  }

  @Post()
  create(@Body() dto: CreateCorrectiveActionDto) {
    return this.service.create(dto);
  }

  @Get('export')
  async export(
    @Query('statusCode') statusCode?: string,
    @Query('priorityCode') priorityCode?: string,
    @Query('format') format: string = 'json',
  ) {
    const data = await this.service.export(statusCode, priorityCode);
    if (format === 'csv') {
      const header = Object.keys(data[0] || {}).join(',');
      const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
      return header + '\n' + rows;
    }
    return data;
  }
}
