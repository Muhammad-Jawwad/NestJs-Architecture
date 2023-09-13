import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createUserDTO } from './DTO/CreateUser.dto';
import { AuthService } from './Services/auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    signInUser( ){

    }

     
    @Post('signup')
    @UsePipes(new ValidationPipe())
    async createUser(@Body() reqBody: createUserDTO){
        const result = await this.authService.createUser(reqBody);
        return result;
    }


}
