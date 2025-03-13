import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import jwtConfig from 'src/config/jwt.config';

@Module({
    controllers: [AuthController],
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.registerAsync({
            useFactory: jwtConfig
        }),
        TypeOrmModule.forFeature([
            User
        ])
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule { }
