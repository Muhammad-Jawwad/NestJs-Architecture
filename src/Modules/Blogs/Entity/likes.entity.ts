import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { UserEntity } from 'src/Modules/Users/Entity/user.entity';
import { BlogEntity } from './blog.entity';
  
@Entity()
export class LikesEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: false
    })
    liked: boolean;

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

    @ManyToOne(() => BlogEntity, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'blogId' })
    blogId: BlogEntity;
}