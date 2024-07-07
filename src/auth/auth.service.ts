import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
// VALIDATE USER
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtService: JwtService
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

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
