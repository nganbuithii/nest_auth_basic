import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CurrentUser, ResponseMessage } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage("create ")
  create(@Body() createRoleDto: CreateRoleDto, @CurrentUser() user:IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage("gel all with pagination ")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.rolesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("gel by id ")
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update ")
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @CurrentUser() user:IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage("delete")
  remove(@Param('id') id: string, @CurrentUser() user:IUser) {
    return this.rolesService.remove(id, user);
  }
}
