import { BadRequestException, Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createUserDTO } from './DTO/CreateUser.dto';
import { AuthService } from './Services/auth.service';
import { jwtAuthDTO } from './DTO/JwtAuth.dto';
import { resetPasswordDTO } from './DTO/ResetPassword.dto';
import { verifyOtpDTO } from './DTO/VerifyOtp.dto';
import { RelationQueryBuilder } from 'typeorm';
import { newPassDTO } from './DTO/NewPass.dto';
import { GoogleAuthGuard } from 'src/Utilities/Google/GoogleAuthGuard';
import { googleAuthDTO } from './DTO/GoogleAuth.dto';
import { AuthType } from 'src/Utilities/Template/types';
import { AuthDTO } from './DTO/Auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService){}

    // @Get('redirect')
    // @UseGuards(GoogleAuthGuard)
    // async redirectUser(){}


    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() body: AuthDTO) {
        console.log("body", body);
        if (body.type === AuthType.Google) {
            const googleAuthDTO = body as googleAuthDTO; // Type assertion
            console.log("googleAuthDTO",googleAuthDTO)
            return this.authService.googleLogin(googleAuthDTO);
        } else if (body.type === AuthType.Jwt) {
            const jwtAuthDTO = body as jwtAuthDTO; // Type assertion
            console.log("jwtAuthDTO",jwtAuthDTO)
            return this.authService.loginUser(jwtAuthDTO);
        } else {
            throw new BadRequestException('Invalid login type.');
        }
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
