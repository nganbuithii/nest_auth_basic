import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator"
import mongoose from "mongoose"

export class CreateRoleDto {
    @IsNotEmpty({message:"name k đc để trống"})
    name: string
    @IsNotEmpty({message:"description không được để trống"})
    description: string
    @IsNotEmpty({message:"trạng thái k đc để trống"})
    @IsBoolean({message:"trạng thái có kiểu bool"})
    isActive: boolean
    
    @IsNotEmpty({message:"quyền k đc để trống"})
    @IsMongoId({each: true, message:" mỗi quyền là một obj id"})
    @IsArray({message:"permission là array"})
    permissions: mongoose.Schema.Types.ObjectId[];
}
