import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CurrentUser, Public, ResponseMessage } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage(" create new job")
  // để biết ai là người tạo thì thêm user
  create(@Body() createJobDto: CreateJobDto, @CurrentUser() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @ResponseMessage("fetch job with pagination")
  @Public()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("fetch job by id")
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update job")
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    // thêm thông tin user -> để biết user nào cập nhật
    @CurrentUser() user: IUser
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage(" delete a job")
  remove(@Param('id') id: string, @CurrentUser() user:IUser) {
    return this.jobsService.remove(id, user);
  }
}
