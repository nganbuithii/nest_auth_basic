import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';


@Injectable()
export class UsersService implements OnModuleInit {

  constructor(
    @InjectModel(User.name)
    //  để có thể xóa mềm được thêm kiểu SoftDelete
    private userModel: SoftDeleteModel<UserDocument>,
    private configService: ConfigService
  ) { }

  async onModuleInit() {
    const count = await this.userModel.count();
    if (count === 0) {
      const salt = genSaltSync(10);
      const hash = hashSync(this.configService.get<string>("INIT_USER_PASSWORD"), salt);
      await this.userModel.insertMany([
        {
          name: "Eric",
          email: "admin@gmail.com",
          password: hash
        },
        {
          name: "User",
          email: "user@gmail.com",
          password: hash
        },
        {
          name: "User 1",
          email: "user1@gmail.com",
          password: hash
        },
        {
          name: "User 2",
          email: "user2@gmail.com",
          password: hash
        },
        {
          name: "User 3",
          email: "user3@gmail.com",
          password: hash
        }
      ])
    }
  }


  async findAll() {
    return await this.userModel.find({});
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  checkPassword(hash: string, plain: string) {
    return compareSync(hash, plain);
  }

  findOne(id:string){
    if(!mongoose.Types.ObjectId.isValid(id))
      return 'not found user'
    return this.userModel.findOne({
      _id:id
    })
  }
  findOneByUsername(username:string){
   
    return this.userModel.findOne({
      email:username
    })
  }
  checkUserPassword(password:string, hash:string){
    return compareSync(password, hash);
    // sẽ trả ra true hoặc false
  }

  remove(id:string){
    if(!mongoose.Types.ObjectId.isValid(id))
      return 'not found user'
    // để xóa mềm gọi soft delete
    return this.userModel.softDelete
    ({
      _id:id
    })
  }

}
