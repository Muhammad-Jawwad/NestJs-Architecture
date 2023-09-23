import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './Services/payment.service';
import { createCustomerDTO } from './DTO/CreateCustomer.dto';
import { paymentDTO } from './DTO/Payment.dto';
import * as xlsx from 'xlsx';
import { FileInterceptor } from '@nestjs/platform-express';

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
            const result = await this.paymentService.importExcel(jsonData);
            return result;
        } catch (error) {
            console.error('Error processing Excel data:', error);
            throw new Error('Excel data processing failed');
        }
    }
}
