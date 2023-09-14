import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../Entity/user.entity';
import { Repository } from 'typeorm';
import { updateUserDTO } from 'src/Modules/Authentication/DTO/UpdateUser.dto';
import { IUpdateUser } from '../Interfaces/updateUser.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ){}

    async fetchUsers(){
        try{
            const users = await this.userRepository.find();
            if(users.length === 0 ){
                throw new HttpException('No Users found',HttpStatus.NOT_FOUND);
            }
            return users;
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async fetchUserById(id: number){
        try{
            const userById = await this.userRepository.findOne({
                where: { id }
            });
            if(!userById){
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return userById;
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async updateUser(id : number, userRequest : updateUserDTO){
        try{
            const user = await this.userRepository.findOne({
                where: { id }
            })
            console.log(user);
            if(!user){
                throw new HttpException('User not found at that Id', HttpStatus.NOT_FOUND);
            }
            const updateUser: IUpdateUser = userRequest;
            await this.userRepository.update({ id }, updateUser);
            return {
                message: 'User Updated Sucessfully',
            }
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async deleteUser(id: number){
        try{
            const user = await this.userRepository.findOne({
                where: { id }
            })
            console.log(user);
            if(!user){
                throw new HttpException('User not found at that Id', HttpStatus.NOT_FOUND);
            }
            await this.userRepository.delete({id})
            return {
                message: `User having id: ${id} is deleted successfully...`
            }
        }catch(error){
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
}
