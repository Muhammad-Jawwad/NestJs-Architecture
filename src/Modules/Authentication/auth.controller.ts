import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createUserDTO } from './DTO/CreateUser.dto';
import { AuthService } from './Services/auth.service';
import { loginUserDTO } from './DTO/LoginUser.dto';
import { resetPasswordDTO } from './DTO/ResetPassword.dto';
import { verifyOtpDTO } from './DTO/VerifyOtp.dto';
import { RelationQueryBuilder } from 'typeorm';
import { newPassDTO } from './DTO/NewPass.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    @UsePipes(ValidationPipe)
    async signInUser(@Body() authBody: loginUserDTO ){
        const result = await this.authService.loginUser(authBody);
        return result;
    }
     
    @Post('signup')
    @UsePipes(new ValidationPipe())
    async createUser(@Body() reqBody: createUserDTO){
        const result = await this.authService.createUser(reqBody);
        return result;
    }

    @Post('requestResetPassword')
    @UsePipes(ValidationPipe)
    async reqResetPass(@Body() reqBody: resetPasswordDTO){
        const result = await this.authService.requestResetPassword(reqBody);
        return result;
    }

    @Post('verifyOtp')
    @UsePipes(ValidationPipe)
    async verifyOtp(@Body() reqBody: verifyOtpDTO){
        const result = await this.authService.verifyOtp(reqBody);
        return result;
    }

    @Post('resetPassword')
    @UsePipes(ValidationPipe)
    async resetPass(@Body() reqBody: newPassDTO){
        const result =  await this.authService.resetPass(reqBody);
        return result;
    }

}
