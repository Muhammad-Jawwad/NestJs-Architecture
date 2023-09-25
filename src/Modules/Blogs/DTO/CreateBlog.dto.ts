import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';


export class createBlogDTO {
    @IsNotEmpty()
    @IsString()
    blogTitle: string;

    @IsNotEmpty()
    @IsString()
    blogDescription: string;

    @IsNotEmpty()
    @IsString()
    image: string

    @IsNotEmpty()
    @IsNumber()
    purchasedPlanId: number;
}