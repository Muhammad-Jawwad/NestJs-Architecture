import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('NesJs-Architecture')
    .setDescription('NestJs basic architecture')
    .setVersion('1.0.0')
    .addTag('')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // Update bearerFormat to match your token type
      'jwt', // Name of the authorization scheme 
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
    
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/uploads',
  });
  await app.listen(3000);
}
bootstrap();
