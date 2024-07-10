import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import fs from 'fs'
import { diskStorage } from "multer";
import path, { join } from "path";
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    getRootPath = () => {
        return process.cwd();
    };
    //check nếu thư mục k có thì nó tạo mới
    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log('Directory successfully created, or it already exists.');
                return;
            }
            switch (error.code) {
                case 'EEXIST':
                    // Error:
                    // Requested location already exists, but it's not a directory.
                    break;
                case 'ENOTDIR':
                    // Error:
                    // The parent hierarchy contains a file with the same name as the dir
                    // you're trying to create.
                    break;
                default:
                    // Some other error like permission denied.
                    console.error(error);
                    break;
            }
        });
    }
    // đường link động
    createMulterOptions(): MulterModuleOptions {
        return {
            // là 1 biến any
            // giúp cấu hình lưu dữ liệu ở đâu - distorage: lưu trữ ảnh tại đấy - lưu ảnh trong server
            // nên lưu ảnh trên cloud
            storage: diskStorage({
                destination: (req, file, cb) => {
                    // tạo folder
                    // lấy tham số truyền vào header
                    // nếu k truyền thì lưu vào thư mục default
                    const folder = req?.headers?.folder_type ?? "default";
                    // gòi hàm
                    // nếu chưa có thư mục trong public thì tạo folder đóa
                    this.ensureExists(`public/images/${folder}`);
                    // nếu thành công
                    // get root path: đường linbk tuyệt dối
                    // ném vào public để front end có thể xem được
                    cb(null, join(this.getRootPath(), `public/images/${folder}`))
                },
                // chế biến tên file mình lưu trữ
                filename: (req, file, cb) => {
                    //get image extension
                    let extName = path.extname(file.originalname);
                    //get image's name (without extension)
                    let baseName = path.basename(file.originalname, extName);
                    // join tạo ra chuỗi kí tự ngẫu nhiên
                    let finalName = `${baseName}-${Date.now()}${extName}`
                    cb(null, finalName)
                }
            })
        };
    }
}
