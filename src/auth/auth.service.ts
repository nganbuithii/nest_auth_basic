
import { UsersService } from '@/users/users.service';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { IUser } from '@/interfaces/user.interface';
import {Response} from 'express';


@Injectable()
// VALIDATE USER
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtService: JwtService,
        private configService:ConfigService,
        private userService:UsersService
    ) { }

    // user và pass là 2 tham số passport ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        // phải so sánh pass đã băm,
        if (user) {
            const isValid = this.usersService.checkUserPassword(pass, user.password)
            if (isValid == true) {
                return user;
            }
        }
        return null;
    }

    async login(user: any, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refreshToken = this.createRefreshToken(payload);

        // updfate user with refresh token
        await this.userService.updateUserToken(refreshToken,_id);

        // set refresh token as cookie
        // khi mà access token mà hết hạn thì ta sẽ dùng refresh token
        response.cookie('refresh_token',refreshToken,{
            httpOnly:true,
            maxAge:ms(this.configService.get<string>("JWT_REFRESH_EXPRIRE"))  // tính theo mili giây
        })

        return {
            access_token: this.jwtService.sign(payload),
            user:
            {
                _id,
                name,
                email,
                role
            }
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        try {
            const newUser = await this.usersService.register(registerUserDto);
            return {
                _id: newUser._id,
                createdDate: newUser.createdDate
            };
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user.");
        }
    }

    createRefreshToken = (payload :any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn:ms(this.configService.get<string>('JWT_REFRESH_EXPRIRE'))/1000,
        });
        return refreshToken; 
    }


    processNewtoken = (refreshToken :string) => {
        try{
            this.jwtService.verify(refreshToken,{
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })
        }catch(error){
            throw new BadRequestException(" refresh token không hợp lệ , Vui lòng login ")
        }
    }
}
