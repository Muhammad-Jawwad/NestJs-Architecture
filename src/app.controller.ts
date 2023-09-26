import { 
  Controller, 
  Get, 
  Param, 
  Post, 
  Req, 
  Res, 
  UploadedFile, 
  UseInterceptors
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageStorageConfig } from './Configuration/Image/image.config';

@Controller()
@ApiTags()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

//#region : Hello World!

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

//#endregion

//#region : Image Upload Functionality

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

//#endregion

}
