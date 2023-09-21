import { Currency, PlanType } from 'src/Utilities/Template/types';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { PurchasedPlanEntity } from './purchasedPlan.entity';
  

@Entity()
export class PlanEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    planName: string;

    @Column({ 
        default: PlanType.Bronze,
        type: 'varchar'
    })
    planType: PlanType;

    @Column({
        nullable: false,
        default: 0
    })
    amount: number;

    @Column({ 
        default: Currency.USD,
        type: 'varchar'
    })
    currency: Currency;

    @Column({
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        type: 'timestamp',
    })
    createdAt: Date;

    @Column({
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        type: 'timestamp',
    })
    updatedAt: Date;

    //Relations

    @OneToMany(() => PurchasedPlanEntity, (purchasedPlan) => purchasedPlan.planId,{
        // cascade: true,
    })
    purchasedPlans: PurchasedPlanEntity[];
}