import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@/interfaces/user.interface';
import { RolesService } from '@/roles/roles.service';
import { Role } from '@/roles/schemas/role.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private roleService: RolesService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
    }
    async validate(payload: IUser) {
        const { _id, name, email, role } = payload;
        // cần gán thêm permission cho user
        const userRole = role as unknown as { _id: string, name: string };
        const temp = await this.roleService.findOne(userRole._id);

        if (temp && typeof temp === 'object' && 'permissions' in temp) {
            return {
                _id,
                name,
                email,
                role,
                permissions: (temp as Role).permissions
            };
        } else {
            return {
                _id,
                name,
                email,
                role,
                permissions: []
            };
        }
    }
}