import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CheckoutDto {

    @ApiProperty({ example: 'bbe135fb-85ce-4043-813c-224de3395314' })
    @IsNotEmpty()
    subscriptionId: string;

    @ApiProperty({ example: 'price_1N5nTeJcTVqlqy1jTMu0u7hT' })
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 'user@exampple.com' })
    @IsNotEmpty()
    email: string;

}