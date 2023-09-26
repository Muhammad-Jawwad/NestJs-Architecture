import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/Modules/Users/Entity/user.entity';
import { Repository } from 'typeorm';
import { createUserDTO } from '../../Users/DTO/CreateUser.dto';
import { ICreateUser } from 'src/Modules/Users/Interfaces/ICreateUser.interface';
import { comparePassword, encodePassword } from 'src/Utilities/Hashing/bcrypt';
import { jwtAuthDTO } from '../DTO/JwtAuth.dto';
import { IAuthPaylaod } from '../Interfaces/IAuthPayload.interface'
import { JwtService } from '@nestjs/jwt';
import { OtpEntity } from '../Entity/otp.entity';
import { resetPasswordDTO } from '../DTO/ResetPassword.dto';
import { generateOtpCode } from 'src/Utilities/OTP/otpGenerator';
import { vacuaEmail } from 'src/Utilities/Template/emailConstants';
import { transporter } from 'src/Utilities/Email/sendEmail';
import { verifyOtpDTO } from '../DTO/VerifyOtp.dto';
import { newPassDTO } from '../DTO/NewPass.dto';
import { moveImage } from 'src/Utilities/Image/moveImage';
import { googleAuthDTO } from '../DTO/GoogleAuth.dto';
import { AuthType, Roles } from 'src/Utilities/Template/types';
import { IGoogleAuth } from '../Interfaces/IGoogleAuth.interface';
import { IJwtAuth } from '../Interfaces/IJwtAuth.interface';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { facebookAuthDTO } from '../DTO/FacebookAuth.dto';
import { IFacebookAuth } from '../Interfaces/IFacebookAuth.interface';
import { amazonAuthDTO } from '../DTO/AmazonAuth.dto';
import axios from 'axios';
import * as moment from 'moment';


@Injectable()
export class AuthService {
    private readonly client: OAuth2Client;
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    ){
        this.client = new OAuth2Client({
            clientId: configService.get('CLIENT_ID'), // Use 'clientId' here
            clientSecret: configService.get('CLIENT_SECRET'), // Use 'clientSecret' here
        });
    }

    async createUser(createUserDTO: createUserDTO){
        try{
            // console.log("createUserDTO",createUserDTO);
            const { email } = createUserDTO;
            const { picture } = createUserDTO;
            const { role } = createUserDTO;

            const isUserExist = await this.userRepository.findOne({
                where: { email }
            });
            if(isUserExist){
                throw new HttpException('User with this email is already exist', HttpStatus.BAD_REQUEST)
            }
            createUserDTO.password = encodePassword(createUserDTO.password);
            // console.log(createUserDTO.password);
            const reqBody = createUserDTO
            delete reqBody.picture;
            // console.log("reqBody",reqBody);
            
            const userBody: ICreateUser = {
                ...reqBody, // Copy the properties from the original userBody
                loginType: false, // Add the loginType property with the value false
              };
            
            const newUser = this.userRepository.create(userBody);
            const createdUser = await this.userRepository.save(newUser);
            const { id } = createdUser;
            // console.log("Getting the id of the createdUser",createdUser.id);             
            const newPath = moveImage(createdUser.id, picture);
            console.log(newPath);
            
            const updatedUser = this.updateUserPicture(id,newPath);
            return updatedUser;         
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async updateUserPicture(id: number, path: string){
        try{
            const updateUser = {
                picture: path
            }
            await this.userRepository.update({ id }, updateUser);
            const user = await this.userRepository.findOne({
                where: { id }
            })
            return user;
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async loginUser(authDTO: jwtAuthDTO){
        try{
            const authBody : IJwtAuth = authDTO
            const user = await this.validateUser(authBody);
            const payload: IAuthPaylaod = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
            const token = await this.generateToken(payload);
            return {
                statusCode: HttpStatus.OK,
                message: 'Login Succussfully',
                token,
                user,
                type: AuthType.Jwt,
            }
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async googleLogin(authDto: googleAuthDTO) {
        // Implement Google OAuth login logic 
        // Redirect the user to Google OAuth URL or handle it as needed
        // Return the result or redirect URL
        try{
            const authBody: IGoogleAuth = authDto;
            console.log(authBody);
            // You can generate a JWT token for the user and return it along with user information

            const tokenFromUser = authBody.token;
            // I need to verify that token from the google

            const userProfile = await this.verifyAndDecryptToken(tokenFromUser);
            
            console.log("userProfile",userProfile)

            const user = await this.userRepository.findOne({
                where: {
                    email: userProfile.email
                }
            })
            if(!user){
                const userBody = {
                    firstName: userProfile.given_name,
                    lastName: userProfile.name,
                    email: userProfile.email,
                    picture: userProfile.picture,
                    password: "",
                    role: Roles.User,
                    loginType: true,
                    age: null,
                    contact: null
                }
                const newUser = this.userRepository.create(userBody);
                const createdUser = await this.userRepository.save(newUser);

                const payload: IAuthPaylaod = {
                    id: createdUser.id,
                    email: createdUser.email,
                    role: createdUser.role,
                };
                const token = await this.generateToken(payload);
                return {
                    statusCode: HttpStatus.OK,
                    message: 'Sign up and Login Succussfully',
                    accessToken: token,
                    user: createdUser,
                    type: AuthType.Google, // Add the login type to the response
                };
            }
            const payload: IAuthPaylaod = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
            const token = await this.generateToken(payload);

            return {
                statusCode: HttpStatus.OK,
                message: 'Login Succussfully',
                accessToken: token,
                user: user,
                type: AuthType.Google, // Add the login type to the response
            };
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async facebookLogin(authDto: facebookAuthDTO) {
        // Implement Facebook OAuth login logic 
        // Redirect the user to Facebook OAuth URL or handle it as needed
        // Return the result or redirect URL
        try{
            const authBody: IFacebookAuth = authDto;
            console.log(authBody);
            // You can generate a JWT token for the user and return it along with user information

            const tokenFromUser = authBody.token;
            // I need to verify that token from the Facebook

            const userProfile = await this.verifyAndDecryptToken(tokenFromUser);
            
            console.log("userProfile",userProfile)

            const user = await this.userRepository.findOne({
                where: {
                    email: userProfile.email
                }
            })
            if(!user){
                const userBody = {
                    firstName: userProfile.given_name,
                    lastName: userProfile.name,
                    email: userProfile.email,
                    picture: userProfile.picture,
                    password: "",
                    role: Roles.User,
                    loginType: true,
                    age: null,
                    contact: null
                }
                const newUser = this.userRepository.create(userBody);
                const createdUser = await this.userRepository.save(newUser);

                const payload: IAuthPaylaod = {
                    id: createdUser.id,
                    email: createdUser.email,
                    role: createdUser.role,
                };
                const token = await this.generateToken(payload);
                return {
                    statusCode: HttpStatus.OK,
                    message: 'Sign up and Login Succussfully',
                    accessToken: token,
                    user: createdUser,
                    type: AuthType.Facebook, // Add the login type to the response
                };
            }
            const payload: IAuthPaylaod = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
            const token = await this.generateToken(payload);

            return {
                statusCode: HttpStatus.OK,
                message: 'Login Succussfully',
                accessToken: token,
                user: user,
                type: AuthType.Facebook, // Add the login type to the response
            };
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async amazonLogin(authDto: amazonAuthDTO){
        try{
            const {token} = authDto;
            const userProfile = await this.verifyAccessTokenForAmazon(token);
            // Handle successful token verification here
            console.log("userProfile",userProfile)

            const user = await this.userRepository.findOne({
                where: {
                    email: userProfile.email
                }
            })
            if(!user){
                const userBody = {
                    firstName: userProfile.name,
                    lastName: userProfile.name,
                    email: userProfile.email,
                    password: "",
                    role: Roles.User,
                    loginType: true,
                    age: null,
                    contact: null
                }
                const newUser = this.userRepository.create(userBody);
                const createdUser = await this.userRepository.save(newUser);

                const payload: IAuthPaylaod = {
                    id: createdUser.id,
                    email: createdUser.email,
                    role: createdUser.role,
                };
                const token = await this.generateToken(payload);
                return {
                    statusCode: HttpStatus.OK,
                    message: 'Sign up and Login Succussfully',
                    accessToken: token,
                    user: createdUser,
                    type: AuthType.Amazon, // Add the login type to the response
                };
            }
            const payload: IAuthPaylaod = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
            const accessToken = await this.generateToken(payload);

            return {
                statusCode: HttpStatus.OK,
                message: 'Login Succussfully',
                accessToken: accessToken,
                user: user,
                type: AuthType.Amazon, // Add the login type to the response
            }
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async verifyAccessTokenForAmazon(accessToken: string): Promise<any> {
        const url = 'https://api.amazon.com/user/profile';
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
    
        try {
          const response = await axios.get(url, config);
          return response.data;
        } catch (error) {
          // Handle errors, e.g., token validation failure
          throw error;
        }
    }
    
    async verifyAndDecryptToken(idToken: string) {
        try {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: this.configService.get('CLIENT_ID'),
        });
        const payload = ticket.getPayload();
        // The `payload` variable now contains the decoded token data
        return payload;
        } catch (error) {
        // Handle token verification errors
        console.error('Token verification error:', error);
        throw error;
        }
    }

    async validateUser(authDTO: IJwtAuth){
        try{
            const user = await this.userRepository.findOne({
                where: {
                    email: authDTO.email,
                    role: authDTO.role
                }
            })
            if(!user){
                throw new HttpException('User with this email and role not found', HttpStatus.NOT_FOUND);
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
