import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { excelDataDTO } from './ExcelData.dto';

export class rowsOfExcelDTO {
 
    @Type(() => excelDataDTO)
    @ValidateNested({ each: true })
    actions: excelDataDTO[];
}