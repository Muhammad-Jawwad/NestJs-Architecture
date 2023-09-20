import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './Services/payment.service';
import { choosePlanDTO } from './DTO/ChoosePlan.dto';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService){}

    @Post('purchasePlan')
    @UsePipes(ValidationPipe)
    async purchasePlan(@Body() body: choosePlanDTO){
        const result = await this.paymentService.choosePlan(body);
        return result;
    }
}
