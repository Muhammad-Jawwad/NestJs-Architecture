import { IsArray, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';


export class excelDataDTO {
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    planId: number;
}
// import { IsInt, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

// export class excelDataDTO {

//   @IsNotEmpty()
//   @IsNumber()
//   @IsPositive()
//   userId: number;

//   @IsNotEmpty()
//   @IsNumber()
//   @IsPositive()
//   planId: number;
// }

