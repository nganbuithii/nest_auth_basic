import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from '@/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    //  để có thể xóa mềm được thêm kiểu SoftDelete
    private jobModel: SoftDeleteModel<JobDocument>,

  ) { }
  async create(createJobDto: CreateJobDto, user: IUser) {
    // lấy ra các trường của job
    const { name, skills, company, salary, location, quantity, level, description, endDate, startDate, isActive } = createJobDto;

    // Kiểm tra nếu endDate trước startDate
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      throw new BadRequestException('Ngày kết thúc không được trước ngày bắt đầu');
    }

    let newJob = await this.jobModel.create({
      name, skills, company, salary, quantity, level, startDate, endDate, isActive,location,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newJob?._id,
      createdDate: newJob?.createdDate,
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totals = (await this.jobModel.find(filter)).length;
    const totalPage = Math.ceil(totals / defaultLimit);

    const result = await this.jobModel.find(filter)
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
    return await this.jobModel.findById(id);
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const updated = await this.jobModel.updateOne(
      { _id: id },
      {
        ...updateJobDto,
        updatefBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return 'not found job'

    await this.jobModel.updateOne(
      { _id: _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.jobModel.softDelete({ _id })
  }
}
