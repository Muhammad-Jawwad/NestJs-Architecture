import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BlogService } from './Services/blog.service';
import { createBlogDTO } from './DTO/CreateBlog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { blogImageStorageConfig } from 'src/Configuration/Image/blogImage.config';

@Controller('blogs')
export class BlogController {
    constructor(
        private blogService: BlogService
    ){}

    @Post('create')
    @UsePipes(ValidationPipe)
    async createBlog(@Body() blogBody: createBlogDTO){
        console.log("blogBody",blogBody)
        const result = await this.blogService.createBlog(blogBody);
        return result;
    }
}
