import { IsEnum,  IsOptional,  IsString } from 'class-validator';
import { Amount, BlogsCharRestrict, Currency, PlanType, Roles } from 'src/Utilities/Template/types';
export class updatePlanDTO {

    @IsOptional()
    @IsString()
    planName?: string;

    @IsOptional()
    @IsEnum(PlanType)
    planType?: PlanType;

    
    @IsOptional()
    @IsEnum(Amount)
    currency?: Currency;
    
    @IsOptional()
    @IsEnum(Amount)
    amount?: Amount;

    @IsOptional()
    @IsEnum(BlogsCharRestrict)
    charCount?: BlogsCharRestrict;

}