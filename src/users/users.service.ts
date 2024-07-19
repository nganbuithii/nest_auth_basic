import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { CurrentUser } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';
import aqp from 'api-query-params';


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


  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const total = (await this.userModel.find(filter)).length;
    const totalPage = Math.ceil(total / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select("-password")
      .populate(population)
      .exec();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  checkPassword(hash: string, plain: string) {
    return compareSync(hash, plain);
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found user'
    return this.userModel.findOne({
      _id: id
    }).select("-password") // không lấy password
    .populate({path:"role", select:{name:1, _id:1}})
  }
  findOneByUsername(username: string) {

    return this.userModel.findOne({
      email: username
    }).populate({path:"role", select:{name:1, permissions:1}})
  }
  checkUserPassword(password: string, hash: string) {
    return compareSync(password, hash);
    // sẽ trả ra true hoặc false
  }

  async remove(id: string, user: IUser) {
    // không cho xóa user có emial là admin
    // admin@gmail.com
    // nếu muốn cấu hihf động thì cấu hình trong env

    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found user'
    // để xóa mềm gọi soft delete
    const foundUser = await this.userModel.findById("id");
    if(foundUser.email == 'admin@gmail.com'){
      throw new BadRequestException("can not delete user has email admin@gmail.com")
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.userModel.softDelete
      ({
        _id: id
      })
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, address } = user;
    // check logic email đã tồn tại chưa
    const isExist = await this.userModel.findOne({ email: email });
    if (isExist) {
      throw new BadRequestException(`Email đã tồn tại ${email}`);
    }
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(user.password, salt);
    const newUser = await this.userModel.create({
      name, email,
      password: hashedPassword,
      age,
      role: 'USER'
    })
    return newUser;
  }
  async create(createUser: CreateUserDto, @CurrentUser() user: IUser) {
    const { name, email, password, company, age, address } = createUser;

    // Kiểm tra xem email đã tồn tại chưa
    const isExist = await this.userModel.findOne({ email: email });
    if (isExist) {
      throw new BadRequestException(`Email đã tồn tại ${email}`);
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      role: 'USER',
      company: {
        _id: company._id,
        name: company.name,
      },
      createdBy: {
        _id: user._id,
        email: user.email,
      },
      createdDate: new Date(), // Thêm createdDate vào đây nếu cần
    });

    return newUser;
  }


  async update(userUpdate: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne(
      {
        _id: userUpdate._id
      }, {
      ...userUpdate,
      updatefBy: {
        _id: user._id,
        email: user.email
      }
    }
    )
    return updated;
  }

  getHashPassword(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      {
        _id: _id
      }, {
      refreshToken
    }
    )

  }


  findUserByToken = async (refeshToken: string) => {
    return await this.userModel.findOne(
      { refeshToken }
    )
  }
}
