import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CurrentUser, ResponseMessage } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage("create permison")
  create(@Body() createPermissionDto: CreatePermissionDto, @CurrentUser() user:IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage("fetch all permission with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.permissionsService.findAll(+currentPage, +limit, qs);
  }
  

  @Get(':id')
  @ResponseMessage("get permission by id")
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update permission by id")
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @CurrentUser() user:IUser) {
    return this.permissionsService.update(id, updatePermissionDto,user);
  }

  @Delete(':id')
  @ResponseMessage("delete permission by id")
  remove(@Param('id') id: string, @CurrentUser() user:IUser) {
    return this.permissionsService.remove(id,user);
  }
}
