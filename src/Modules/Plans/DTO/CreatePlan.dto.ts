import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { PlanType, Roles } from 'src/Utilities/Template/types';

export class createPlanDTO {

    @IsNotEmpty()
    @IsString()
    planName: string;

    @IsNotEmpty()
    @IsEnum(PlanType)
    planType: PlanType;

}