import { ConfigService } from '@nestjs/config';
import { Permission, PermissionDocument } from '@/permissions/schemas/permission.schema';
import { Role, RoleDocument } from '@/roles/schemas/role.schema';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';



// để kết nối đến database
// => viết ở services
@Injectable()
export class DatabasesService implements OnModuleInit {
    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,
        // @InjectModel(Role.name)
        // private roleModel: SoftDeleteModel<RoleDocument>,

        private configService:ConfigService,
    ) { }
    onModuleInit() {
        // VIẾT CÁC XỬ LÍ Ở ĐÂY
        console.log(`The module has been initialized.`);
    }
}
