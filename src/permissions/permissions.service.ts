import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from '@/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    //  để có thể xóa mềm được thêm kiểu SoftDelete
    private permissionModel: SoftDeleteModel<PermissionDocument>,

  ) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const isExist = await this.permissionModel.findOne({ apiPath, method });
    if (isExist) {
      throw new BadRequestException(`permission với apiPath=${apiPath}, method=${method} đã tồn tại`)
    }

    const newPer = await this.permissionModel.create({
      name, apiPath, method, module,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newPer?._id,
      createdAt: newPer?.createdDate
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totals = (await this.permissionModel.find(filter)).length;
    const totalPage = Math.ceil(totals / defaultLimit);

    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, // trang hiện tại
        pageSize: limit,
        pages: totalPage, // tổng số trang với điều kiện query
        totals: totals, // tổng số phần tử
      },
      result
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found job'
    return await this.permissionModel.findById(id);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found job'

    const { apiPath, name, method, module } = updatePermissionDto;
    const updated = await this.permissionModel.updateOne(
      { id },
      {
        apiPath, name, method, module,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return updated;
  }

  async remove(id: string, user:IUser) {
    await this.permissionModel.updateOne(
      {id},
      {
        deletedBy:{
          _id:user._id,
          email:user.email
        }
      }
    )
    return this.permissionModel.softDelete({_id:id})
  }
}
