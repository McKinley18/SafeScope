import { Controller, Post, Body, Get } from '@nestjs/common';
import { InspectionService } from './inspection.service';

@Controller('inspections')
export class InspectionController {
  constructor(private service: InspectionService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
