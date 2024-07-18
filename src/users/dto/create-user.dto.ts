import { Type } from "class-transformer";
import { IsEmail, IsEmpty, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}
export class CreateUserDto {
    // Validate các trường nhập liệu
    @IsNotEmpty({ message: 'Tên không được để trống', })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống', })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống', })
    password: string;

    @IsNotEmpty({ message: "Tuổi không được để trống" })
    age: number

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    address: string;


    @IsNotEmpty({ message: "Quyền không được để trống" })
    role: string;

    // validate object
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}

// dùng ở phía client
export class RegisterUserDto extends CreateUserDto {
    // Sử dụng tất cả các thuộc tính từ CreateUserDto
}
