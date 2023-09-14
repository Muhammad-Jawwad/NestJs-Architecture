import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './Services/users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Utilities/Jwt/jwtAuthGuard';
import { ExtendedRequest } from 'src/Utilities/Template/extented-request.interface';
import { updateUserDTO } from '../Authentication/DTO/UpdateUser.dto';
import { retry } from 'rxjs';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get()
    @UseGuards(JwtAuthGuard) 
    async fetchUsers(@Req() req: ExtendedRequest){
        console.log("Req",req.user);
        const result = await this.usersService.fetchUsers();
        return result;
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param('userId', ParseIntPipe) id: number){
        const result = await this.usersService.fetchUserById(id);
        return result;
    }

    @Patch('update/:userId')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async updateUser(@Param('userId', ParseIntPipe) id: number, @Body() reqBody: updateUserDTO){
        if(Object.keys(reqBody).length === 0){
            throw new HttpException('Empty Body request is not allowed',HttpStatus.BAD_REQUEST);
        }
        const result = await this.usersService.updateUser(id, reqBody);
        return result;
    }
    
    @Delete('delete/:userId')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async deleteUser(@Param('userId', ParseIntPipe) id: number){
        const result = await this.usersService.deleteUser(id);
        return result;
    }

}
