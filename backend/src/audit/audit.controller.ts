import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  private getAuthContext(authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('Missing authorization token');

    const secret = process.env.JWT_SECRET || 'safescope_dev_secret_change_me';

    try {
      return jwt.verify(token, secret) as {
        sub: string;
        email: string;
        tenantId: string;
        role: string;
      };
    } catch {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }

  @Get()
  findWorkspaceAudit(@Headers('authorization') authorization: string) {
    const auth = this.getAuthContext(authorization);

    if (!['owner', 'admin'].includes(auth.role)) {
      throw new UnauthorizedException('Only owners and admins can view audit logs.');
    }

    return this.auditService.getAuditByTenant(auth.tenantId);
  }
}
