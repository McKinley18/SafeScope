import { Body, Controller, Delete, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; tenantId?: string; workspaceType?: 'individual' | 'company'; companyName?: string; firstName?: string; lastName?: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Get('workspace/users')
  getWorkspaceUsers(@Headers('authorization') authorization: string) {
    return this.authService.getWorkspaceUsers(authorization);
  }

  @Get('workspace/summary')
  getWorkspaceSummary(@Headers('authorization') authorization: string) {
    return this.authService.getWorkspaceSummary(authorization);
  }

  @Post('invite')
  createInvite(@Headers('authorization') authorization: string, @Body() body: { email: string; role?: 'admin' | 'manager' | 'inspector' | 'viewer' }) {
    return this.authService.createInvite(authorization, body);
  }

  @Post('invite/accept')
  acceptInvite(@Body() body: { inviteToken: string; firstName: string; lastName: string; password: string }) {
    return this.authService.acceptInvite(body);
  }

  @Post('password-reset/request')
  requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body);
  }

  @Post('password-reset/confirm')
  confirmPasswordReset(@Body() body: { email: string; token: string; newPassword: string }) {
    return this.authService.confirmPasswordReset(body);
  }

  @Delete('reset-users')
  resetUsers(@Headers('x-reset-secret') secret: string) {
    if (secret !== (process.env.RESET_SECRET || 'safescope-reset')) {
      throw new UnauthorizedException('Invalid reset secret');
    }

    return this.authService.resetUsers();
  }
}
