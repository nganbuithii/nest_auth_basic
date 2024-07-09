import { IUser } from '@/interfaces/user.interface';
import { AuthService } from './auth.service';
import { CurrentUser, Public, ResponseMessage } from '@/decorator/customizes';
import { LocalAuthGuard } from '@/stateless/passport/stateless.local.guard';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import {Request, Response} from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService) {} 

    @Public()
    @ResponseMessage("Đăng kí người dùng")
    @Post('/register')
    handleRegister(@Body() registerUserDto:RegisterUserDto){
        return this.authService.register(registerUserDto);
    }


    // api login
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ResponseMessage(" uSSER login")
    handleLogin(
        @Req() req, 
        @Res({passthrough:true}) response : Response)
    {
        return this.authService.login(req.user, response);
    }


    @Get('/account')
    @ResponseMessage(" get information user")
    handleGetAccount(@CurrentUser() user: IUser)
    {
        return {user}
    }
}
