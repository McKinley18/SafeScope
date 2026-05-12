import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  
  @UseGuards(JwtAuthGuard)
  @Get()
  getTasks(@Req() req: any) {
    return {
      message: 'Protected route accessed',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(@Body() body: any, @Req() req: any) {
    return {
      message: 'Task created',
      user: req.user,
      data: body,
    };
  }
}
