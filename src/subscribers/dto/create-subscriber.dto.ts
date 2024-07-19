import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({message:" name không được để trống"})
    name: string;
    @IsNotEmpty({message:" email không được để trống"})
    @IsEmail({}, {message:"email không đúng định dạng"})
    email: string;

    @IsNotEmpty({message:" skill không được để trống"})
    @IsArray({message:"skill là định dạng mảng"})
    @IsString({each:true, message:"skill đinh dạng là string"})
    skills: string[]
}
