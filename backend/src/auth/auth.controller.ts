import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Post('forgot-password')
  forgot(@Body() body: any) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  reset(@Body() body: any) {
    return this.authService.resetPassword(body.token, body.password);
  }
}
