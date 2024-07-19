import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from '@/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SubcriberDocument, Subscriber } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    //  để có thể xóa mềm được thêm kiểu SoftDelete
    private subcriberModel: SoftDeleteModel<SubcriberDocument>,

  ) { }
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { name, email, skills } = createSubscriberDto;
    const isExist = await this.subcriberModel.findOne({ email })
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại`)
    }
    let newSub = await this.subcriberModel.create({
      name, email, skills,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newSub?._id,
      createdBy: newSub?.createdDate
    }
  }

  findAll() {
    return `This action returns all subscribers`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found subcriber'
    return await this.subcriberModel.findOne({_id:id})
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user:IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found job'

    const { name, email, skills } = updateSubscriberDto;
    const isExist = await this.subcriberModel.findOne({ email});
    if (isExist) {
      throw new BadRequestException(`Role với name = ${name}đã tồn tại`)
    }

    const update = await this.subcriberModel.updateOne(
      { id }, {
      ...updateSubscriberDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    }
    )
    return update;
  }

  async remove(id: string, user:IUser) {
    // không cho xóa role admin
    const foundSub = await this.subcriberModel.findById("id");
    
    await this.subcriberModel.updateOne(
      { id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.subcriberModel.softDelete({ _id: id })

  }
}
