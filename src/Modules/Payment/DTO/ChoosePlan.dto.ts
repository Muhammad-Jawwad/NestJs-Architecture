import { IsNotEmpty, IsNumber } from 'class-validator';

export class choosePlanDTO {

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    planId: number;
}