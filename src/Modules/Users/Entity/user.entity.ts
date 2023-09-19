import {
    Column,
    Entity,
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

}