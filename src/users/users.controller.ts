import { Controller, Get, Post, Body, Patch, Param, Delete,  Query, UseGuards, Req, UnauthorizedException,  NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser, Public, ResponseMessage } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('users')
// @UseGuards(JwtAuthGuard) 
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }


  @Post('create')
  @Public()
  @ResponseMessage("create a user")
  async create(@Body() u:  CreateUserDto)
  {
    let newUser = await this.usersService.create(u);
    return {
      _id: newUser?._id,
      createdDate: newUser?.createdDate,
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)  
  @ResponseMessage('Update user information')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: IUser
  ) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('delete a user')
  remove(@Param('id') id : string, @CurrentUser() user:IUser){
    return this.usersService.remove(id, user);
  }

  // @Public()
  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // @ResponseMessage("fetch usere by id")
  // async findOne(@Param('id') id: string)
  // {
  //   const foundUser = await this.usersService.findOne(id);
  //   return foundUser;
  // }

  // phân trang - find all
  @Public()
  @Get()
  @ResponseMessage(' fetch user with pagination')
  findAll(
    @Query("current") currentPage : string,
    @Query("pageSize") limit:string,
    @Query() qs:string
  ){
    return this.usersService.findAll(+currentPage, +limit, qs)
  }

  @Get('current')
  @UseGuards(JwtAuthGuard) // Ensure the user is authenticated
  @ResponseMessage('Fetch current user data')
  async getCurrentUser(@CurrentUser() user: IUser) {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const foundUser = await this.usersService.findOne(user._id);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }
}
