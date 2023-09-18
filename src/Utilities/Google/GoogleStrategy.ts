import passport from "passport";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

    constructor(
        private configService: ConfigService
    ){
        super({
            clientID: configService.get('CLIENT_ID'),
            clientSecret: configService.get('CLIENT_SECRET'),
            callbackURL: configService.get('CALLBACK_URL'),
            scope: ['profile', 'email'],
        })
    }


    async validate(accessToken: string, refreshToken: string, profile: Profile) {

        const { name, emails , photos} = profile
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken 
        }; // Replace with your user retrieval logic
    }
}
