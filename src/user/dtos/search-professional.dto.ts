import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { randomUUID } from "crypto";

export class SearchProfessionalDto {

    @ApiPropertyOptional({
        example: 'test',
        description: 'search through firstName, lastName, fullName, and email'
    })
    @IsOptional()
    @IsString()
    search: string

    @ApiPropertyOptional({
        example: randomUUID(),
        description: 'provide the UUID of the logged in user to remove from the list of professionals'
    })
    @IsOptional()
    @IsString()
    @IsUUID()
    user_id: string
}