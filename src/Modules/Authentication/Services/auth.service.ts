import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/Modules/Users/Entity/user.entity';
import { Repository } from 'typeorm';
import { createUserDTO } from '../DTO/CreateUser.dto';
import { ICreateUser } from 'src/Modules/Users/Interfaces/createUser.interface';
import { encodePassword } from 'src/Utilities/Hashing/bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ){}

    async createUser(createUserDTO: createUserDTO){
        try{
            const { email } = createUserDTO;
            const isUserExist = await this.userRepository.findOne({
                where: { email }
            });
            if(isUserExist){
                throw new HttpException('User with this email is already exist', HttpStatus.BAD_REQUEST)
            }
            
            createUserDTO.password = encodePassword(createUserDTO.password);
            console.log(createUserDTO.password);
            const userBody:ICreateUser = createUserDTO;
            const newUser = this.userRepository.create(userBody);
            const createdUser = await this.userRepository.save(newUser);
            return createdUser;         
        }catch (error) {
        throw new HttpException(
            error.message,
            error.status || HttpStatus.BAD_REQUEST,
        );
        }
    }
}
