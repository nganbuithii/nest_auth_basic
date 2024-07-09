import { IUser } from '@/interfaces/user.interface';
import { AuthService } from './auth.service';
import { CurrentUser, Public, ResponseMessage } from '@/decorator/customizes';
import { LocalAuthGuard } from '@/stateless/passport/stateless.local.guard';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @ResponseMessage("Đăng kí người dùng")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }


    // api login
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ResponseMessage(" uSSER login")
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }


    @Get('/account')
    @ResponseMessage(" get information user")
    handleGetAccount(@CurrentUser() user: IUser) {
        return { user }
    }

    @Get('/refresh')
    @ResponseMessage(" get user refresh ")
    handleRefreshToken(@Req() request: Request,
        @Res({ passthrough: true }) response: Response) {
        // key neyf bên auth services
        const refreshToken = request.cookies["refresh_token"];
        return this.authService.processNewtoken(refreshToken, response);
    }

    @Post("/logout")
    @ResponseMessage("logout user")
    handleLogOut(
        @Res({passthrough: true}) response: Response,
        @CurrentUser() user: IUser
    ){
        return this.authService.logout(response, user)
    }



}
