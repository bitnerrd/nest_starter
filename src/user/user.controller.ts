import { Body, Controller, Request, Get, Post, UseGuards, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { UserEntity } from 'src/entities/user/user.entity';
import { RoleDto, SendSubAdminDetailsDto, UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { SearchProfessionalDto } from './dtos/search-professional.dto';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt-auth/admin-jwt-auth.guard';

@ApiTags('User')
@Crud({
    model: {
        type: UserEntity,
    },
    routes: {
        exclude: ['replaceOneBase', 'createManyBase', 'createOneBase', 'updateOneBase'],
    },
    query: {
        maxLimit: 50,
        alwaysPaginate: true,
        join: {
            profilePic: {
                eager: true,
                exclude: ['updatedAt', 'createdAt', 'metaData', 'encoding']
            },        
        }
    },
    params: {
        id: {
            type: 'uuid',
            primary: true,
            field: 'id',
        },
    },
})
@Controller({
    path: 'user',
    version: '1',
})
export class UserController implements CrudController<UserEntity> {
    constructor(
        readonly service: UserService
    ) { }

    get base(): CrudController<UserEntity> {
        return this;
    }

    @UseGuards(JwtAuthGuard)
    @Post('update')
    async updateUser(@Request() req, @Body() dto: UpdateUserDto) {
        return await this.service.updateUser(req.user.id, dto)
    }

}   