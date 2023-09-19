import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './Services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../Users/Entity/user.entity';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
import { OtpEntity } from './Entity/otp.entity';
import { JwtStrategy } from 'src/Utilities/Jwt/jwtStrategy';
import { GoogleStrategy } from 'src/Utilities/Google/GoogleStrategy';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from 'src/Utilities/Facebook/FacebookStrategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserEntity,OtpEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory:async (configService: ConfigService) =>  ( {
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn:  configService.get('JWT_SECRET_EXPIRY') },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
