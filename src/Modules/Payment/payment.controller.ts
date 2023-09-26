import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './Services/payment.service';
import { createCustomerDTO } from './DTO/CreateCustomer.dto';
import { paymentDTO } from './DTO/Payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelStorageConfig } from 'src/Configuration/Excel/excel.config';
import { ApiTags } from '@nestjs/swagger';

@Controller('payments')
@ApiTags('Payments')
export class PaymentController {
    constructor(private paymentService: PaymentService){}

//#region : Customers CRUD

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

//#endregion

//#region : Stripe Functionality
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

//#endregion

//#region : Excel Import User Data and Choose Plan

    @Post('excel')
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('file',{
        storage: excelStorageConfig
    })) 
    async processExcelData(
        @UploadedFile() fileData 
    ){
        const result = await this.paymentService.importExcel(fileData);
        return result;
    }

//#endregion
}
