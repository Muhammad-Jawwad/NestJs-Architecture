import { IsEnum,  IsOptional,  IsString } from 'class-validator';
import { PlanType, Roles } from 'src/Utilities/Template/types';
export class updatePlanDTO {

    @IsOptional()
    @IsString()
    planName?: string;

    @IsOptional()
    @IsEnum(PlanType)
    planType?: PlanType;

}