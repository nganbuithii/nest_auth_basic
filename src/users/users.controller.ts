import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser, Public, ResponseMessage } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // api thêm user - đối với HR -cần token
  @Post()
  @ResponseMessage("create a user")
  async create(@Body() u:  CreateUserDto, @CurrentUser() user:IUser)
  {
    let newUser = await this.usersService.create(u,user);
    return {
      _id: newUser?._id,
      createdDate: newUser?.createdDate,
    }
  }

  // API PATCH
  @Patch()
  async update(@Body() upUserdto:UpdateUserDto, @CurrentUser() user: IUser){
    let updateU = await this.usersService.update(upUserdto, user);
    return updateU;
  }

  @Delete(':id')
  @ResponseMessage('delete a user')
  remove(@Param('id') id : string, @CurrentUser() user:IUser){
    return this.usersService.remove(id, user);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("fetch usere by id")
  async findOne(@Param('id') id: string)
  {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }
}
