import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/Modules/Users/Entity/user.entity';
import { Repository } from 'typeorm';
import { createUserDTO } from '../DTO/CreateUser.dto';
import { ICreateUser } from 'src/Modules/Users/Interfaces/createUser.interface';
import { comparePassword, encodePassword } from 'src/Utilities/Hashing/bcrypt';
import { loginUserDTO } from '../DTO/LoginUser.dto';
import { IAuthPaylaod } from '../Interfaces/IAuthPayload.interface'
import { JwtService } from '@nestjs/jwt';
import { OtpEntity } from '../Entity/otp.entity';
import * as moment from 'moment';
import { resetPasswordDTO } from '../DTO/ResetPassword.dto';
import { generateOtpCode } from 'src/Utilities/OTP/otpGenerator';
import { vacuaEmail } from 'src/Utilities/Template/emailConstants';
import { transporter } from 'src/Utilities/Email/sendEmail';
import { verifyOtpDTO } from '../DTO/VerifyOtp.dto';
import { newPassDTO } from '../DTO/NewPass.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
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

    async loginUser(authDTO: loginUserDTO){
        try{
            const user = await this.validateUser(authDTO);
            const payload: IAuthPaylaod = {
                id: user.id,
                email: user.email,
            };
            const token = await this.generateToken(payload);
            return {
                statusCode: HttpStatus.OK,
                message: 'Login Succussfully',
                token,
                user
            }
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
    async validateUser(authDTO: loginUserDTO){
        try{
            const user = await this.userRepository.findOne({
                where: {
                    email: authDTO.email
                }
            })
            if(!user){
                throw new HttpException('User with this email not found', HttpStatus.NOT_FOUND);
            }
            const isCorrectPass = comparePassword(authDTO.password,user.password);
            if(!isCorrectPass){
                throw new HttpException('Invalid Password',HttpStatus.NOT_ACCEPTABLE);
            }
            return user;
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
    async generateToken(IAuthPaylaod: IAuthPaylaod){
        try{
            const token =  this.jwtService.sign(IAuthPaylaod);
            return token;
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async requestResetPassword(resetPasswordDTO:resetPasswordDTO){
        try{
            let otpCode:any;
            let currTime = new Date();
            let expiryTime = moment().add(15, 'minutes').format();
            const isUserExist = await this.userRepository.findOne({
                where: {
                    email: resetPasswordDTO.email
                }
            });
            if(!isUserExist){
                throw new HttpException('User not found with this email.', HttpStatus.NOT_FOUND);
            }
            const otpAlreadyExist = await this.otpRepository.findOne({
                where: {
                    email: resetPasswordDTO.email
                }
            })
            if(otpAlreadyExist){
                if(otpAlreadyExist.expiry > currTime){
                    otpCode = otpAlreadyExist.code;
                } else{
                    otpCode = generateOtpCode(4);
                } 
            } else{
                otpCode = generateOtpCode(4);
            }

            var mailOptions = {
                from: vacuaEmail,
                to: isUserExist.email,
                subject: 'OTP CHANGED',
                html: `<h1>Your code is ${otpCode}</h1>`,
            };
        
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log('Error transporter email', error);
                } else {
                    const insertForgotPassData = {
                        email: isUserExist.email,
                        code: otpCode,
                        expiry: expiryTime,
                    }; 
                    const insertedRes = this.otpRepository.create(
                        insertForgotPassData,
                    );
                    const getInsertedRes = await this.otpRepository.save(
                        insertedRes,
                    );
                    console.log(getInsertedRes);
                }
            });
            return {
                message: 'Otp has been sent successfully!',
            };
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async verifyOtp(otpCode:verifyOtpDTO) {
        try{
            let currTime = new Date();
            const isCodeVerified = await this.otpRepository.findOne({
                where:{
                    code: otpCode.code
                }
            });
            if(!isCodeVerified){
                throw new HttpException('Invalid OTP code', HttpStatus.NOT_FOUND);
            }
            if(currTime > isCodeVerified.expiry){
                await this.otpRepository.delete({ id: isCodeVerified.id });
                throw new HttpException('OTP code expired. Please generate new!', HttpStatus.NOT_FOUND);
            }
            const token = this.jwtService.sign({ email: isCodeVerified.email });
            return {
                message: 'Proceed further',
                token
            }
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async resetPass(newPass:newPassDTO){
        try{
            const decodedToken = await this.jwtService.verifyAsync(
               newPass.token
            );
            const otp = await this.otpRepository.findOne({
                where: {
                    email: decodedToken.email
                }
            });
            if(!otp){
                throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
            }
            const user = await this.userRepository.findOne({
                where: {
                    email: decodedToken.email
                }
            });
            const isSameNewPass = comparePassword(newPass.password, user.password);
            if(isSameNewPass){
                throw new HttpException('Cannot set this password', HttpStatus.NOT_ACCEPTABLE);
            }

            const decodedPass = encodePassword(newPass.password);

            user.password = decodedPass;

            await this.userRepository.save(user);
            await this.otpRepository.delete({
                email: decodedToken.email
            });
            return {
                message: 'Password has been changed successfully'
            };
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
}
