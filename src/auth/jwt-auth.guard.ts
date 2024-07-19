
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
        // Sử dụng url thay vì originalUrl
        const targetEndpoint = request.url as string;

        const permissions = user?.permissions ?? [];
        let isExist = permissions.find(permission => targetMethod === permission.method
            && targetEndpoint === permission.apiPath // Sử dụng url thay cho originalUrl
        );
        
        // Cho phép các yêu cầu tới endpoint auth
        if (targetEndpoint.startsWith("/api/v1/auth")) {
            isExist = true;
        }

        if (!isExist) {
            throw new ForbiddenException("Bạn không có quyền truy cập endpoint này");
        }
        return user;
    }
}