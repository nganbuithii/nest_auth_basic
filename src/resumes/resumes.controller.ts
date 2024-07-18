import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { CurrentUser, ResponseMessage } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage(" create a new resume")
  // để lưu veetrs ai là người tạo, mình cần thêm tham số User
  // xong ném qua service xử lí
  create(@Body() createUserCVDto: CreateResumeDto, @CurrentUser() user:IUser) {
    return this.resumesService.create(createUserCVDto, user);
  }

  @Get()
  @ResponseMessage(" get all resume with pagination")
  findAll(
    @Query("current") currentPage:string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.resumesService.findAll(+currentPage, +limit , qs,);
  }

// lấy tất cả cv của 1 userr
// nên dùng method post
  @Post("by-user")
  @ResponseMessage("get resume by user")
  getResumeByUser(@CurrentUser() user:IUser){
    return this.resumesService.findByUsers(user);
  }

  @Get(':id')
  @ResponseMessage("get resume by id")
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update resume by id")
  update(@Param('id') id: string, @Body("status") status: string, @CurrentUser() user:IUser){
    return this.resumesService.update(id, status,user);
  }

  @Delete(':id')
  @ResponseMessage(" delete resume by id")
  remove(@Param('id') id: string, @CurrentUser() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
