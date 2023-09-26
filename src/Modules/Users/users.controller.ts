import { 
    Body, 
    Controller,
    Query, 
    Delete, 
    Get, 
    HttpException, 
    HttpStatus, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    Req, 
    Res, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors, 
    UsePipes, 
    ValidationPipe 
} from '@nestjs/common';
import { UsersService } from './Services/users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Utilities/Jwt/jwtAuthGuard';
import { updateUserDTO } from '../Users/DTO/UpdateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { imageStorageConfig } from 'src/Configuration/Image/image.config';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private usersService: UsersService){}

//#region : Users CRUD
    @Get()
    async fetchUsers(
        @Query("page") page:number,
        @Query("limit") limit:number,
        @Query("email") email:string
        ){
        const result = await this.usersService.fetchUsers(limit, page, email);
        return result;
    }

    @Get('withPagination')
    // @UseGuards(JwtAuthGuard) 
    async fetchUsersByNestJsPagination(@Paginate() query: PaginateQuery){
        const result = await this.usersService.fetchUsersByNestJsPagination(query);
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

//#endregion

}
