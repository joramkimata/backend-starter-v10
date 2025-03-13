import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "../dto/login.dto";
import { User } from "src/users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthMessages } from "../enums/auth-message.enum";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { JwtPayload } from "../strategies/jwt.strategy";
import { hashing } from "src/shared/helpers/hashing.helper";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }


    async getUserPermissions(username: string) {

        const permissionsArray = [];

        const user = await this.userRepository.findOne({
            where: {
                deleted: false,
                username
            },
            relations: ['roles', 'roles.permissions']
        });


        if (!user) return [].join(',');

        if (user.roles) {

            user.roles.forEach(r => {
                if (r.permissions) {
                    r.permissions.forEach(p => {
                        permissionsArray.push(p.name);
                    })
                }
            });

            if (permissionsArray) return permissionsArray.join(',');

        }

        return [].join(',');


    }

    async login({ username, password }: LoginDto) {
        const user = await this.userRepository.findOne({
            where: {
                username,
                deleted: false,
                active: true
            }
        });

        if (user == null) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        if (user.active != true) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        const { password: pass, refreshToken, ...rest } = user

        const payload: any = { user: rest, refreshToken: false, permissions: await this.getUserPermissions(user.username) };
        const payloadRefreshToken: TokenPayload = { ...payload, refreshToken: true };

        const myRefreshToken = this.jwtService.sign(payloadRefreshToken, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        });

        user.refreshToken = await hashing(myRefreshToken);

        await this.userRepository.save(user);

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: myRefreshToken
        };
    }

    async getUserFromJwtPayload(payload: JwtPayload) {

        if (!payload) throw new UnauthorizedException();

        // prevent passing refresh token as access token 
        if (payload.refreshToken) {
            throw new UnauthorizedException(AuthMessages.ACCESS_TOKEN_ONLY);
        }


        const user = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid: payload.user.uuid
            },
            relations: ['roles']
        });

        if (!user) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        // checks if user logged out
        if (!user.refreshToken) {
            throw new UnauthorizedException(AuthMessages.LOGGED_OUT);
        }

        return user;
    }

    // async logout(user: User) {
    //     const dbUser = await this.userRepository.findOne({
    //         username: user.username
    //     });

    //     if (dbUser) {
    //         dbUser.refreshToken = '';
    //         await this.userRepository.save(dbUser);

    //         return {
    //             "message": "successfully logged out!"
    //         }
    //     }
    // }

    // async refresh(refreshToken: string) {

    //     try {
    //         const { user } = this.jwtService.decode(refreshToken) as JwtPayload;

    //         const dbUser = await this.userRepository.findOne({
    //             uuid: user.uuid,
    //             deleted: false,
    //             active: true
    //         });

    //         if (!dbUser) {
    //             throw new UnauthorizedException('User not found');
    //         }

    //         const hashedRefreshToken = dbUser.refreshToken;

    //         if (!hashedRefreshToken) {
    //             throw new UnauthorizedException();
    //         }

    //         if (!hashCompare(refreshToken, hashedRefreshToken)) {
    //             throw new UnauthorizedException();
    //         }

    //         const payload = { user, refreshToken: false };

    //         return {
    //             access_token: this.jwtService.sign(payload),
    //         }

    //     } catch (e) {
    //         throw new UnauthorizedException('Expired Refresh Token');
    //     }

    // }


}