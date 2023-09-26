import { 
    BadRequestException, 
    Body, 
    Controller, 
    Get, 
    Post, 
    UseGuards, 
    UsePipes, 
    ValidationPipe 
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createUserDTO } from '../Users/DTO/CreateUser.dto';
import { AuthService } from './Services/auth.service';
import { jwtAuthDTO } from './DTO/JwtAuth.dto';
import { resetPasswordDTO } from './DTO/ResetPassword.dto';
import { verifyOtpDTO } from './DTO/VerifyOtp.dto';
import { newPassDTO } from './DTO/NewPass.dto';
import { googleAuthDTO } from './DTO/GoogleAuth.dto';
import { AuthType } from 'src/Utilities/Template/types';
import { AuthDTO } from './DTO/Auth.dto';
import { facebookAuthDTO } from './DTO/FacebookAuth.dto';
import { amazonAuthDTO } from './DTO/AmazonAuth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

//#region : Login and Sigup
    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() body: AuthDTO) {
        if (body.type === AuthType.Google) {
            const googleAuthDTO = body.google as googleAuthDTO; // Type assertion
            console.log("googleAuthDTO",googleAuthDTO)
            return this.authService.googleLogin(googleAuthDTO);
        } else if (body.type === AuthType.Jwt) {
            const jwtAuthDTO = body.jwt as jwtAuthDTO; // Type assertion
            console.log("jwtAuthDTO",jwtAuthDTO)
            return this.authService.loginUser(jwtAuthDTO);
        } else if (body.type === AuthType.Facebook) {
            const fbAuthDTO = body.facebook as facebookAuthDTO; // Type assertion
            console.log("fbAuthDTO",fbAuthDTO)
            // return this.authService.facebookLogin(fbAuthDTO);
            return {
                msg: 'This login method is under maintenance'
            }
        } else if (body.type === AuthType.Amazon) {
            const amazonAuthDTO = body.amazon as amazonAuthDTO; // Type assertion
            console.log("amazonAuthDTO",amazonAuthDTO)
            return this.authService.amazonLogin(amazonAuthDTO);
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

//#endregion

//#region : Login and Sigup
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

//#endregion

}
