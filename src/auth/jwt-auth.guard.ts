import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();

        if (err || !user) {
            throw err || new UnauthorizedException('Invalid token');
        }

        request.user = user; // Ensure user is added to request object
        return user;
    }
}

// import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from '@/decorator/customizes';
// import {
//     BadRequestException,
//     ExecutionContext,
//     ForbiddenException,
//     Injectable,
//     UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { AuthGuard } from '@nestjs/passport';
// import { request } from 'express';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//     constructor(private reflector: Reflector) {
//         super();
//     }

//     canActivate(context: ExecutionContext) {
//         const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);
//         if (isPublic) {
//             return true;
//         }
//         return super.canActivate(context);
//     }
//     andleRequest(err, user, info, context: ExecutionContext) {
//         const request = context.switchToHttp().getRequest<Request>();

//         if (err || !user) {
//             throw err || new UnauthorizedException('Invalid token');
//         }

//         request.user = user; // Ensure user is added to request object
//         return user;
//     }
//     // handleRequest(err, user, info, context: ExecutionContext) {
//     //     const request = context.switchToHttp().getRequest<Request>();
        
//     //     const isSkipPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION, [
//     //         context.getHandler(),
//     //         context.getClass(),
//     //     ]);

//     //     if (err || !user) {
//     //         throw err || new UnauthorizedException("TOKEN không hợp lệ");
//     //     }

//     //     // const targetMethod = request.method;
//     //     // const targetEndpoint = request.url as string;

//     //     // const permissions = user?.permissions ?? [];
//     //     // let isExist = permissions.find(permission => 
//     //     //     targetMethod === permission.method && 
//     //     //     targetEndpoint === permission.apiPath 
//     //     // );

//     //     // if (targetEndpoint.startsWith("/api/v1/auth")) {
//     //     //     isExist = true;
//     //     // }

//     //     // if (!isExist && !isSkipPermission) {
//     //     //     throw new ForbiddenException("Bạn không có quyền truy cập endpoint này");
//     //     // }
        
//     //     return user;
//     // }
// }
