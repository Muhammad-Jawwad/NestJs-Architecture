import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { PurchasedPlanEntity } from 'src/Modules/Plans/Entity/purchasedPlan.entity';
import { LikesEntity } from './likes.entity';
  
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
    numberOfLikes: number;

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

    //Relations
    
    @OneToMany(() => LikesEntity, (like) => like.blogId, {
        cascade: true,
    })
    likes: LikesEntity[];
}