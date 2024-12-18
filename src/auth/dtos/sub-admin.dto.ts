import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches
} from "class-validator";
import { ProfessionEnum } from 'src/utils/enums/enums';
import { SubAdminPermissionsDto } from './sub-admin-permissions.dto';

export class AddSubAdminDto {

    @ApiProperty({
        required: true,
        type: String,
        description: 'email',
        example: "johndoe@example.com"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'Usama@123'
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 64)
    @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/)
    password: string;

    constructor(creds: { email: string; password: string }) {
        this.email = creds?.email;
        this.password = creds?.password;
    }

    @ApiProperty({ example: "John" })
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: "I am passionate about using my voice to support and empower others. Whether it's fighting for social justice, promoting environmental sustainability, or advocating for the needs of marginalized communities, I am committed to using my platform to make a positive impact on the world." })
    @IsNotEmpty()
    about: string;

    @ApiProperty({ example: "c522829b-dab3-4abb-b68b-9ebcc6f5094b" })
    @IsOptional()
    profilePic: string;

    @ApiProperty({ example: "c522829b-dab3-4abb-b68b-9ebcc6f5094b" })
    @IsOptional()
    resume: string;

    @ApiProperty({ type: SubAdminPermissionsDto })
    @IsOptional()
    permissions: SubAdminPermissionsDto
}