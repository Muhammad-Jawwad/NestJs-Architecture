import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './Services/payment.service';
import { choosePlanDTO } from './DTO/ChoosePlan.dto';
import { createCustomerDTO } from './DTO/CreateCustomer.dto';
import { JwtAuthGuard } from 'src/Utilities/Jwt/jwtAuthGuard';
import { request } from 'http';
import { paymentDTO } from './DTO/Payment.dto';

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
}
