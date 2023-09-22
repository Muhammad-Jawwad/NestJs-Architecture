import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './Services/payment.service';
import { choosePlanDTO } from './DTO/ChoosePlan.dto';
import { createCustomerDTO } from './DTO/CreateCustomer.dto';
import { JwtAuthGuard } from 'src/Utilities/Jwt/jwtAuthGuard';
import { request } from 'http';
import { paymentDTO } from './DTO/Payment.dto';
import * as xlsx from 'xlsx';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { isNumber, validate } from 'class-validator';
import { excelDataDTO } from './DTO/ExcelData.dto';
import { rowsOfExcelDTO } from './DTO/RowsOfExcel.dto';
import { IExcelData } from './Interfaces/IExcelData.interface';
import { skip } from 'node:test';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService){}

    @Get()
    checking(){
        const result = this.paymentService.checking();
        return result;
    }

    @Get('customers')
    async getCustomers(){
        const result = await this.paymentService.fetchCustomer();
        return result;
    }

    @Post('createCustomer')
    @UsePipes(ValidationPipe)
    async createCustomer(@Body() customerBody: createCustomerDTO){
        console.log("Body", customerBody);
        const result = await this.paymentService.createCustomer(customerBody);
        return result;
    }

    @Post('purchase')
    @UsePipes(ValidationPipe)
    async purchasePlan(@Body() body: paymentDTO) {
        const result = await this.paymentService.payment(body);
        return result;
    }

    @Get('createToken')
    async createToken(){
        const result = await this.paymentService.createToken();
        return result;
    }

    @Post('excel')
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('file')) 
    async processExcelData(@UploadedFile() fileData) {
        console.log("Received file data:", fileData);

        try {
            const workbook = xlsx.read(fileData.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Assuming you have one sheet
            const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
             // Validate each item in jsonData array before passing it to importExcel
             const mappedArray: excelDataDTO[] = jsonData.map((item: IExcelData) => {
                const userPlan = new excelDataDTO();
                if (isNumber(item.userId) && isNumber(item.planId)) {
                  userPlan.userId = item.userId;
                  userPlan.planId = item.planId;
                  return userPlan;
                } else {
                  return null; // Return null for items that do not meet the condition
                }
              });
              const userPlans = mappedArray.filter((obj) => obj !== null);


            const validationErrors = await validate(userPlans);

            if (validationErrors.length > 0) {
                console.error('Validation errors:');
                validationErrors.forEach((error) => {
                console.error(error);
                });
                throw new Error('Validation failed');
            }

            // Now, you can call importExcel with the validated data
            const result = await this.importExcel({ actions: userPlans });

            return result;
        } catch (error) {
            console.error('Error processing Excel data:', error);
            throw new Error('Excel data processing failed');
        }
    }

    @UsePipes(ValidationPipe)
    async importExcel(jsonData: rowsOfExcelDTO){
        console.log("Validated")
        return jsonData
    }
}
