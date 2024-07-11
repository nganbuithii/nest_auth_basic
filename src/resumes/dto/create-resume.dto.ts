import { IsEmail, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    // không nền validate như này'
    // các tham số như email hay userId: nên lấy DỘNG
    @IsEmail()
    @IsNotEmpty({message:" email không được để trống"})
    email: string;

    @IsNotEmpty({message:" Id user không được để trống"})
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message:" url khôngđược để trống"})
    url: string;

    @IsNotEmpty({message:" trạng thái không được để trống"})
    status: string;

    @IsNotEmpty({message:" Id công ty không được để trống"})
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message:" Id công việc không được để trống"})
    jobId: mongoose.Schema.Types.ObjectId;
}

export class createUserCVDto{
    @IsNotEmpty({message:" url khôngđược để trống"})
    url: string;

    @IsNotEmpty({message:" Id công ty không được để trống"})
    @IsMongoId({message:"companyId  is a mongo id"})
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message:" Id job không được để trống"})
    @IsMongoId({message:"jobId  is a mongo id"})
    jobId: mongoose.Schema.Types.ObjectId;
}