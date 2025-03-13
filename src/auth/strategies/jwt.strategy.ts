import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "../services/auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


export interface JwtPayload {
    user: User,
    refreshToken: boolean,
    permissions?: String[]
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECURITY_KEY,
        });
    }

    async validate(payload: JwtPayload) {
        return this.authService.getUserFromJwtPayload(payload);
    }
}