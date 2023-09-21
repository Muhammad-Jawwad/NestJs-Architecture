import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { Currency } from 'src/Utilities/Template/types';
export class createChargeDTO {

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    @IsEnum(Currency)
    currency: Currency

    @IsNotEmpty()
    @IsEmail()
    email: string;
}