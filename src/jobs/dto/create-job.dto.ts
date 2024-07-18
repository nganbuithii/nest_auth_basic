import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator"
import mongoose from "mongoose"
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}
export class CreateJobDto {
    // validate dữ liệu của job
    @IsNotEmpty({ message: "tên không được để trống" })
    name: string

    @IsNotEmpty({ message: "skill không được để trống" })
    @IsArray({ message: "skill có định dạng là array" })
    @ArrayMinSize(1)
    // kiểm tra các phần tử có là string k
    @IsString({ each: true, message: "skill định dạng là string" })
    skills: string[]

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: "location không được để trống" })
    location: string

    @IsNotEmpty({ message: "salarry không được để trống" })
    salary: number


    @IsNotEmpty({ message: "salarry không được để trống" })
    quantity: number

    @IsNotEmpty({ message: "salarry không được để trống" })
    level: string

    @IsNotEmpty({ message: "salarry không được để trống" })
    description: string;

    @IsNotEmpty({message:"end date không được để trống"})
    @Transform(({value}) => new Date(value))
    @IsDate({message:"end date phải là định dạng là date"})
    endDate: Date;

    @IsNotEmpty({message:"start date không được để trống"})
    // hàm transform chuyển dữ liệu sang dnagj Date
    @Transform(({value}) => new Date(value))
    @IsDate({message:"startdate phải là định dạng là date"})
    startDate: Date;


    @IsNotEmpty({message:"trạng thái k được để trống"})
    @IsBoolean({message:"trạng thái có kiểu là boole"})
    isActive: boolean;

    @IsNotEmpty({message:"logo không được để trống"})
    logo: string;
}
