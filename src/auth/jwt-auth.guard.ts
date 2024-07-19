
import { IS_PUBLIC_KEY } from '@/decorator/customizes';
import {
    BadRequestException,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>(); // Sửa gọi hàm
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("TOKEN không hợp lệ");
        }
        // check permission
        const targetMethod = request.method;
        // Nếu bạn cần kiểm tra endpoint, bạn có thể phải dùng cách khác
        // const targetEndpoint = request.route?.path;

        const permissions = user?.permissions ?? [];
        const isExist = permissions.find(permission => targetMethod === permission.method
            // && targetEndpoint === permission.apiPath // Loại bỏ hoặc thay đổi cách lấy endpoint
        );

        if (!isExist) {
            throw new ForbiddenException("Bạn không có quyền truy cập endpoint này");
        }
        return user;
    }
}