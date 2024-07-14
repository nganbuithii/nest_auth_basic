import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
class UpdatedBy {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
class History {
    @IsNotEmpty()
    status: string;

@IsNotEmpty()
    updatedAt: Date;

@ValidateNested()
@IsNotEmpty()
@Type(()=>UpdatedBy)
    updatedBy:UpdatedBy
}
export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({message:" history không được để trống"})
    @IsArray({ message:" history phải là một mảng"})
    @ValidateNested()
    @Type(() => History)
    history: History[];
}
