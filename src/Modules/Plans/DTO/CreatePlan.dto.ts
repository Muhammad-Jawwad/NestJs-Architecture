import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { Amount, BlogsCharRestrict, Currency, PlanType, Roles } from 'src/Utilities/Template/types';

export class createPlanDTO {

    @IsNotEmpty()
    @IsString()
    planName: string;

    @IsNotEmpty()
    @IsEnum(PlanType)
    planType: PlanType;

    // @IsOptional()
    // @IsEnum(Amount)
    // amount: Amount;

    @IsNotEmpty()
    @IsEnum(Currency)
    currency: Currency;

    // @IsOptional()
    // @IsEnum(BlogsCharRestrict)
    // charCount: BlogsCharRestrict;
}