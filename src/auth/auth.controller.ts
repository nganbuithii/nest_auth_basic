import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '@/decorator/customizes';
import { LocalAuthGuard } from '@/stateless/passport/stateless.local.guard';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

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
    handleLogin(@Request() req)
    {
        return this.authService.login(req.user)
    }
}
