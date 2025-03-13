import { Controller, Post, HttpCode, Body } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../services/auth.service";


@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('login')
    @HttpCode(200)
    login(@Body() login: LoginDto) {
        return this.authService.login(login);
    }

    // @Get('/profile')
    // @UseGuards(JwtAuthGuard)
    // @HttpCode(200)
    // getProfile(
    //     @GetUser() user: User
    // ) {
    //     user.password = undefined;
    //     return user;
    // }

    // @Get('/logout')
    // @UseGuards(JwtAuthGuard)
    // logout(
    //     @GetUser() user: User
    // ) {
    //     return this.authService.logout(user);
    // }

    // @Post('/refresh')
    // refresh(
    //     @Body('refreshToken') refreshToken: string
    // ) {
    //     return this.authService.refresh(refreshToken);
    // }
}