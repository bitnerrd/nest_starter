import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class SubAdminPermissionsDto {

    @ApiProperty({
        description: '',
        example: true
    })
    @IsBoolean()
    @IsNotEmpty()
    userControl: boolean

    @ApiProperty({
        description: '',
        example: true
    })
    @IsBoolean()
    @IsNotEmpty()
    advisorsRequest: boolean

    @ApiProperty({
        description: '',
        example: false
    })
    @IsBoolean()
    @IsNotEmpty()
    startupRequests: boolean

    @ApiProperty({
        description: '',
        example: false
    })
    @IsBoolean()
    @IsNotEmpty()
    accessToMailingList: boolean

    @ApiProperty({
        description: '',
        example: false
    })
    @IsBoolean()
    @IsNotEmpty()
    newsletter: boolean

    @ApiProperty({
        description: '',
        example: false
    })
    @IsBoolean()
    @IsNotEmpty()
    otherEmailCampaigns: boolean
}