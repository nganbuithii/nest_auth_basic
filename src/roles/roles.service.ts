<<<<<<< HEAD
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from '@/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {

  constructor(
    @InjectModel(Role.name)
    //  để có thể xóa mềm được thêm kiểu SoftDelete
    private roleModel: SoftDeleteModel<RoleDocument>,

  ) { }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;

    const isExist = await this.roleModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException(`Role với name = ${name}đã tồn tại`)
    }

    const newRole = await this.roleModel.create({
      name, description, isActive, permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      id: newRole?.id,
      createdAt: newRole?.createdDate
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totals = (await this.roleModel.find(filter)).length;
    const totalPage = Math.ceil(totals / defaultLimit);

    const result = await this.roleModel.find(filter)
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
    return await this.roleModel.findById(id)
      .populate({ path: "permissions", select: { _id: 1, apiPath: 1, name: 1, method: 1 } })
    // số 1 là lấy các trường này của permission
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found job'

    const {name, description, isActive, permissions} = updateRoleDto;
    const isExist = await this.roleModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException(`Role với name = ${name}đã tồn tại`)
    }

    const update = await this.roleModel.updateOne(
      {id},{
        name, description, isActive, permissions,
        updatedBy:{
          _id: user._id,
          email:user.email
        }
      }
    )
    return update;
  }

  async remove(id: string, user:IUser) {
    await this.roleModel.updateOne(
      {id},
      {
        deletedBy:{
          _id:user._id,
          email:user.email
        }
      }
    )
    return this.roleModel.softDelete({_id:id})
=======
import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
>>>>>>> 1c00af9b99c2f319d0e4302cfc669e55cea62fe2
  }
}
