import { Body, Controller, Delete, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; tenantId?: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Delete('reset-users')
  resetUsers(@Headers('x-reset-secret') secret: string) {
    if (secret !== (process.env.RESET_SECRET || 'safescope-reset')) {
      throw new UnauthorizedException('Invalid reset secret');
    }

    return this.authService.resetUsers();
  }
}
