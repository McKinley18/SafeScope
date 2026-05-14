import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('organization')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/settings')
  getMySettings(@Req() req: Request & { user?: any }) {
    return this.service.findOne(req.user.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/settings')
  updateMySettings(
    @Req() req: Request & { user?: any },
    @Body() body: { riskProfileId?: string; name?: string; logoPath?: string },
  ) {
    return this.service.updateSettings(req.user.organizationId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/members')
  getMyMembers(@Req() req: Request & { user?: any }) {
    return this.service.getMembers(req.user.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/invites')
  getMyInvites(@Req() req: Request & { user?: any }) {
    return this.service.getInvitations(req.user.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/invite')
  inviteToMyOrganization(
    @Req() req: Request & { user?: any },
    @Body() body: { email: string; role: string },
  ) {
    return this.service.createInvitation(req.user.organizationId, body.email, body.role || 'Auditor');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  invite(@Param('id') id: string, @Body() body: { email: string; role: string }) {
    return this.service.createInvitation(id, body.email, body.role);
  }
}
