import { BadRequestException, Injectable } from '@nestjs/common';

import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from '@/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateUserCVDto } from './dto/create-resume.dto';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    //  để có thể xóa mềm được thêm kiểu SoftDelete
    private resumeModel: SoftDeleteModel<ResumeDocument>,

  ) { }
  async create(createUserCVDto: CreateUserCVDto, user: IUser) {
    // b1: lấy ra thông tin từ request,body
    const { url, companyId, jobId } = createUserCVDto;
    const { email, _id } = user;

    const newCv = await this.resumeModel.create({
      url, companyId, email, jobId,
      userId: _id, status: "PENDING",
      createdBy: { _id, email },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          }
        }
      ]
    })

    return {
      _id: newCv?._id,
      createAt:newCv?.createdAt
    }
  }

  async findAll(currentPage:number, limit: number, qs: string) {
    const { filter, sort, population} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit? +limit :10;

    const totalsItem = (await this.resumeModel.find(filter)).length;
    const totalsPage = Math.ceil(totalsItem/ defaultLimit);

    const result = await this.resumeModel.find(filter).skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .exec();

    return {
      meta:{
        current: currentPage,
        pageSize: limit,
        pages: totalsPage,

      }
    }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(" not found resume")
    }
    return await this.resumeModel.findById(id);
  }

  async update(id: string, status: string, user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(" not found resume")
    }

    const updated  = await this.resumeModel.updateOne(
      {_id:id},
      {
        status,
        updatedBy:{
          _id: user._id,
          email: user.email
        },
        // toán tử push là thêm vào mảng
        // nếu k có $push thì nó sẽ ghi đè lên lịch sử cũ
        $push:{
          history:{
            status:status,
            updateAt: new Date,
            updatedBy:{
              _id: user._id,
              email:user.email
            }
          }
        }
      }
    )
  }

  async remove(id: string, user:IUser) {
    await this.resumeModel.updateOne(
      {_id:id},{
        deletedBy:{
          _id:user._id,
          email: user.email
        }
      }
    )
    return this.resumeModel.softDelete({_id:id})
  }
  async findByUsers(user:IUser){
    return await this.resumeModel.find({
      userId:user._id
    })
  }
}
