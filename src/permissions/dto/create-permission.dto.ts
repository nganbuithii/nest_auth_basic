import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsNotEmpty({ message: "api path không đc để trống" })
    apiPath: string
    @IsNotEmpty({ message: " method không được để trống" })
    method: string
    @IsNotEmpty({ message: " module không được để trống" })
    module: string //thuộc modules nào ?
}
