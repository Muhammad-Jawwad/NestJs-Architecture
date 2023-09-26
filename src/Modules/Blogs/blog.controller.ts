import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BlogService } from './Services/blog.service';
import { createBlogDTO } from './DTO/CreateBlog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { blogImageStorageConfig } from 'src/Configuration/Image/blogImage.config';
import { ApiTags } from '@nestjs/swagger';
import { updateBlogDTO } from './DTO/UpdateBlog.dto';
import { clickLikeDTO } from './DTO/ClickLike.dto';

@Controller('blogs')
@ApiTags('Blogs')
export class BlogController {
    constructor(
        private blogService: BlogService
    ){}

//#region : Blogs CRUD

    @Post('create')
    @UsePipes(ValidationPipe)
    async createBlog(@Body() blogBody: createBlogDTO){
        console.log("blogBody",blogBody)
        const result = await this.blogService.createBlog(blogBody);
        return result;
    }
    
    @Get()
    async getBlogs(){
        const result = await this.blogService.fetchBlogs();
        return result;
    }
    
    @Get('blogById/:blogId')
    async getBlogById(@Param('blogId', ParseIntPipe) id: number){
        const result = await this.blogService.fetchBlogById(id);
        return result;
    }
    
    @Get('blogById/:userId')
    async getBlogByUserId(@Param('userId', ParseIntPipe) id: number){
        const result = await this.blogService.fetchBlogByUserId(id);
        return result;
    }

    @Patch('update/:blogId')
    @UsePipes(ValidationPipe)
    async updateBlog(@Param('blogId', ParseIntPipe) id: number, @Body() blogBody: updateBlogDTO){
        console.log("blogBody",blogBody)
        const result = await this.blogService.updateBlog(id, blogBody);
        return result;
    }

//#endregion

//#region : Handling Like Button

    @Post('handleLikeButton')
    @UsePipes(ValidationPipe)
    async handleLike(@Body() likeBody: clickLikeDTO){
        const result = await this.blogService.clickLike(likeBody);
        return result;
    }

//endregion
}
