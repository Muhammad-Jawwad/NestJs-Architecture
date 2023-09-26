import { IsEmail, IsEnum, IsOptional, IsNumber, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';


export class updateBlogDTO {
    @IsOptional()
    @IsString()
    blogTitle?: string;

    @IsOptional()
    @IsString()
    blogDescription?: string;

    @IsOptional()
    @IsString()
    image?: string
}