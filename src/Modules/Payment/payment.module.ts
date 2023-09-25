
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './Services/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../Users/Entity/user.entity';
import { PlanEntity } from '../Plans/Entity/plan.entity';
import { PurchasedPlanEntity } from '../Plans/Entity/purchasedPlan.entity';
import { StripeConfig } from 'src/Configuration/Stripe/stripe.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, PlanEntity, PurchasedPlanEntity])
    ],
    controllers: [PaymentController],
    providers: [PaymentService, StripeConfig],

})
export class PaymentModule {}