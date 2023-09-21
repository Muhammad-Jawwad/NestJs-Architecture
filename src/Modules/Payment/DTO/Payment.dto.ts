import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class paymentDTO {

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    planId: number;

    @IsNotEmpty()
    @IsString()
    payment_method: string;
}