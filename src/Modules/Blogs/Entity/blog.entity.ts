import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { PurchasedPlanEntity } from 'src/Modules/Plans/Entity/purchasedPlan.entity';
  
@Entity()
export class BlogEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: ""
    })
    blogTitle: string;

    @Column({
        default: ""
    })
    blogDescription: string;

    @Column({ 
        nullable: true,
        type: 'varchar' 
    })
    image: string;

    @Column({ 
        default: 0 
    })
    likes: string;

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

    @ManyToOne(() => PurchasedPlanEntity, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'purchasedPlanId' })
    purchasedPlanId: PurchasedPlanEntity;
}