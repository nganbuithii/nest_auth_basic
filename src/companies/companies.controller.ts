import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '@/users/schemas/user.schema';
import { CurrentUser, ResponseMessage } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }
  
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  // phải truyền thamn số
  @ResponseMessage("fetch list company with pageinator")
  findAll(
    // @Query("page") curentPage:string,
    // @Query("limit") limit:string,
    @Query("current") currentPage: string,
    @Query("pagesize") limit: string,
    // const limit:string = req.query.limit
    @Query() querystring: string
  ) {
    return this.companiesService.findAll(+currentPage, +limit, querystring);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  //  Bài tập 57. update companies
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: IUser, // Sử dụng decorator để lấy user hiện tại
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
