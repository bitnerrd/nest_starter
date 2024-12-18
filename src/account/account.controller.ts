import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateUserDto as UpdateAccountDto } from './dtos/update.account.dto';
import { UserService as AccountService } from './account.service';
import { CreateAccountDto } from './dtos/ create.account.dto';

@ApiTags('Accounts')
@Controller({
  path: 'accounts',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(readonly service: AccountService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.service.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'List accounts with pagination' })
  @ApiResponse({ status: 200, description: 'List of accounts' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.service.findAll({
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.service.update(id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
