import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateVisitorDto } from './user/dtos/update-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('v1/visitor')
  async createVisitor(@Body() dto: CreateVisitorDto) {
    return await this.appService.createVisitor(dto);
  }

}
