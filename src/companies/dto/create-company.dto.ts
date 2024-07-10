import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty({message:"tên công ty không được để trống"})
    name: string;

    @IsNotEmpty({message:"Mô tả không được để trống"})
    description: string;

    @IsNotEmpty({message:"Logo cty không được để trống"})
    logo: string;
}
