import { PlanEntity } from 'src/Modules/Plans/Entity/plan.entity';
import { PurchasedPlanEntity } from 'src/Modules/Plans/Entity/purchasedPlan.entity';
import { Roles } from 'src/Utilities/Template/types';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    firstName: string;

    @Column({ type: 'varchar' })
    lastName: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ 
        default: Roles.User,
        type: 'varchar' 
    })
    role: Roles;

    @Column({ 
        nullable: true,
        type: 'varchar' 
    })
    picture: string;

    @Column({
        nullable:true
    })
    age: number;

    @Column({
        nullable:true
    })
    contact: string;

    @Column({ default: false })
    loginType: boolean;

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

    @OneToMany(() => PurchasedPlanEntity, (purchasedPlan) => purchasedPlan.userId,{
        cascade: true,
    })
    purchasedPlans: PurchasedPlanEntity[];

}