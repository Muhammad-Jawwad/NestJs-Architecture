import { UserEntity } from 'src/Modules/Users/Entity/user.entity';
import { PlanType } from 'src/Utilities/Template/types';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { PlanEntity } from './plan.entity';
  

@Entity()
export class PurchasedPlanEntity {

    @PrimaryGeneratedColumn()
    id: number;

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

    // Forign Keys 

    @ManyToOne(() => UserEntity, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    userId: UserEntity;


    @ManyToOne(() => PlanEntity, {
        
        eager: true,
        // onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'planId' })
    planId: PlanEntity;
}