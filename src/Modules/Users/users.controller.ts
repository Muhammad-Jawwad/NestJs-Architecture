import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './Services/users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Utilities/Jwt/jwtAuthGuard';
import { ExtendedRequest } from 'src/Utilities/Template/extented-request.interface';
import { updateUserDTO } from '../Users/DTO/UpdateUser.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

import { imageStorageConfig } from 'src/Configuration/Image/image.config';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get()
    // @UseGuards(JwtAuthGuard) 
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

    @Get('getfile/:imgPath')
    getImage(@Param('imgPath') image, @Res() res){
        return res.sendFile(image, {root: 'public/temp'})
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('picture', {
        storage: imageStorageConfig
    }))
    uploadFile(
        @UploadedFile() file: Express.Multer.File ,
        @Req() req: Request
    ) {
        const filename = req['picture'];
        console.log(`Uploaded filename: ${filename}`);
        return {
            imagePath: filename,
        };
    }
}
