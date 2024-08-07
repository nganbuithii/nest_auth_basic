import { RolesService } from './../roles/roles.service';

import { UsersService } from '@/users/users.service';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { IUser } from '@/interfaces/user.interface';
import { Response } from 'express';


@Injectable()
// VALIDATE USER
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private userService: UsersService,
        private roleService: RolesService,
    ) { }

    // user và pass là 2 tham số passport ném về
    // async validateUser(username: string, pass: string): Promise<any> {
    //     const user = await this.usersService.findOneByUsername(username);
    //     if (user) {
    //         const isValid = this.usersService.checkUserPassword(pass, user.password)
    //         if (isValid == true) {
    //             const userRole = user.role as unknown as { _id: string, name: string }
    //             const temp = await this.roleService.findOne(userRole._id);

    //             if (typeof temp === 'object' && 'permissions' in temp) {
    //                 const objUser = {
    //                     ...user.toObject(),
    //                     permissions: temp.permissions
    //                 }
    //                 return objUser;
    //             } else {
    //                 // Xử lý khi không tìm thấy quyền
    //                 const objUser = {
    //                     ...user.toObject(),
    //                     permissions: []
    //                 }
    //                 return objUser;
    //             }
    //         }
    //     }
    //     return null;
    // }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            return null; // Người dùng không tồn tại
        }
        const isValid = this.usersService.checkUserPassword(pass, user.password);
        if (isValid) {
            return user; // Trả về người dùng nếu mật khẩu hợp lệ
        }
        return null; // Mật khẩu không đúng
    }
    
    


    // async login(user: any, response: Response) {
    //     const { _id, name, email, role } = user;
    //     const payload = {
    //         sub: "token login",
    //         iss: "from server",
    //         _id,
    //         name,
    //         email,
    //         role
    //     };
    //     const refreshToken = this.createRefreshToken(payload);

    //     // updfate user with refresh token
    //     await this.userService.updateUserToken(refreshToken, _id);

    //     // set refresh token as cookie
    //     // khi mà access token mà hết hạn thì ta sẽ dùng refresh token
    //     response.cookie('refresh_token', refreshToken, {
    //         httpOnly: true,
    //         maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPRIRE"))  // tính theo mili giây
    //     })

    //     return {
    //         access_token: this.jwtService.sign(payload),
    //         user:
    //         {
    //             _id,
    //             name,
    //             email,
    //             role
    //         }
    //     };
    // }
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
    
        await this.userService.updateUserToken(refreshToken, _id);
    
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPRIRE"))
        });
    
        return {
            access_token: this.jwtService.sign(payload),
            user: { _id, name, email, role }
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

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPRIRE')) / 1000,
        });
        return refreshToken;
    }


    processNewtoken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })

            let user = await this.userService.findUserByToken(refreshToken);
            console.log(user);

            if (user) {
                // update reffresh token
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
                // do _id đang là object id nên phải chuyển sang thành string
                await this.userService.updateUserToken(refreshToken, _id.toString());

                // set refresh token as cookie
                // khi mà access token mà hết hạn thì ta sẽ dùng refresh token
                // xóa đi cookie cũ
                response.clearCookie("refresh_token")

                // gán cookie mới
                response.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPRIRE"))  // tính theo mili giây
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
            } else {
                throw new BadRequestException("")
            }
        } catch (error) {
            throw new BadRequestException(" refresh token không hợp lệ , Vui lòng login ")
        }
    }

    logout = async (reponse: Response, user: IUser) => {
        // set refresh tokenm bằng rỗng
        await this.userService.updateUserToken("", user._id);

        // xóa cookie
        reponse.clearCookie("refresh_token");
        return " ok"
    }
}
