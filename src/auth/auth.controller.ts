import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '@/decorator/customizes';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService) {} 

    @Public()
    @ResponseMessage("Đăng kí người dùng")
    @Post('/register')
    handleRegister(@Body() registerUserDto:RegisterUserDto){
        return this.authService.register(registerUserDto);
    }
}
