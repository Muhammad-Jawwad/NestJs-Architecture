import { PlansController } from './plans.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './Entity/plan.entity';
import { PurchasedPlanEntity } from './Entity/purchasedPlan.entity';
import { PlansService } from './Services/plans.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PlanEntity, 
            PurchasedPlanEntity
        ])
    ],
    controllers: [PlansController],
    providers: [PlansService]
})
export class PlansModule {}
