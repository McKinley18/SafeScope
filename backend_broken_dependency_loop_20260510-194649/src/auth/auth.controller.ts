import { Body, Controller, Post, UseGuards, Get, Param, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto & { inviteToken?: string }) {
    return this.authService.register(dto);
  }

  @Get('verify-invite/:token')
  verifyInvite(@Param('token') token: string) {
    return this.authService.verifyInvite(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }

  // 🔷 RATE LIMITING: Apply specific protection to login to prevent brute-force
  @UseGuards(ThrottlerGuard)
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
