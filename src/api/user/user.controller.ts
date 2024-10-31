import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserServices } from "./user.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UserProfileUpdateDTO } from "./user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("user")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags("User")
export class UserController {
  constructor(private readonly userServices: UserServices) {}
  @Put("profile/update")
  async updateProfile(@Req() req: any, @Body() body: UserProfileUpdateDTO) {
    const user = req.auth.user;
    const response = await this.userServices.updateProfile(user, body);
    return response;
  }

  @Get("profile")
  async userProfile(@Req() req: any) {
    return await this.userServices.returnUser(req.auth.user);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = await this.userServices.saveUploadedFile(file);
    return { filePath };
  }
}
