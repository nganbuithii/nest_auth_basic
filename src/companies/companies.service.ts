import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@/interfaces/user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';


@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    //  để có thể xóa mềm được thêm kiểu SoftDelete
    private companyModel: SoftDeleteModel<CompanyDocument>,
    private configService: ConfigService
  ) { }
  create(createCompanyDto: CreateCompanyDto) {
    return 'This action adds a new company';
  }


  // khi test api truyền tham số /?page=3&limit=10
  async findAll(currentpage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pagesize;

    let offset = (+currentpage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result =  this.companyModel.find(filter)
      .skip(skip)
      .limit(limit)
      //@ts-ignore
      // khi thêm dòng này thì nó sẽ bỏ check type cho mình
      // có thể thêm dòng đó hoặc viết cách khác .sort(sort as any)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentpage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result 
    }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
    {
      throw new BadRequestException(" not found companies with id")
    }
    return await this.companyModel.findById(id);
  }

  // Bài 57; Bài tập update companies
  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
  }

  async remove(id: string, user: IUser) {
    // sử dụng 2 câu query 
    await this.companyModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.companyModel.softDelete({ _id: id })
  }
}
