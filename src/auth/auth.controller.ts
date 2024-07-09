import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '@/decorator/customizes';
import { LocalAuthGuard } from '@/stateless/passport/stateless.local.guard';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
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
}
