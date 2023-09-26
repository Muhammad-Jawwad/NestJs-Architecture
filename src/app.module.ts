import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Modules/Authentication/auth.module';
import { UsersModule } from './Modules/Users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { forDatabaseMySqlAsyncConfig } from './Configuration/Database/orm.config';
import { config } from 'dotenv';
import { PlansModule } from './Modules/Plans/plans.module';
import { PaymentModule } from './Modules/Payment/payment.module';
import { BlogModule } from './Modules/Blogs/blog.module';


@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      load: [config] 
    }),
    TypeOrmModule.forRootAsync(
      forDatabaseMySqlAsyncConfig
    ),
    AuthModule, 
    UsersModule,
    PlansModule,
    PaymentModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
