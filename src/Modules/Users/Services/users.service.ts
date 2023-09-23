import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../Entity/user.entity';
import { Repository } from 'typeorm';
import { updateUserDTO } from 'src/Modules/Users/DTO/UpdateUser.dto';
import { IUpdateUser } from '../Interfaces/IUpdateUser.interface';
import { FilterOperator, FilterSuffix, Paginate, PaginateQuery, paginate, Paginated } from 'nestjs-paginate'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ){}

    async fetchUsers(query: PaginateQuery): Promise<Paginated<UserEntity>>{
        try{
            return paginate(query, this.userRepository, {
                sortableColumns: ['id', 'firstName', 'lastName', 'age'],
                defaultSortBy: [['id', 'DESC']],
                searchableColumns: ['firstName', 'lastName'],
                select: ['id', 'firstName', 'lastName', 'age'],
                filterableColumns: {
                  firstName: [FilterOperator.EQ, FilterSuffix.NOT],
                  lastName: [FilterOperator.EQ, FilterSuffix.NOT],
                  email: [FilterOperator.EQ],
                  age: true,
                },
              })
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
