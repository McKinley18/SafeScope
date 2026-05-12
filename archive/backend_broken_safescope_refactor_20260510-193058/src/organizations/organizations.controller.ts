import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('organization')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  invite(@Param('id') id: string, @Body() body: { email: string, role: string }) {
    return this.service.createInvitation(id, body.email, body.role);
  }
}
