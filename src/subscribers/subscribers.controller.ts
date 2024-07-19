import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { CurrentUser, ResponseMessage } from '@/decorator/customizes';
import { IUser } from '@/interfaces/user.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage("create a subcriber")
  create(@Body() createSubscriberDto: CreateSubscriberDto, @CurrentUser() user:IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Get()
  findAll() {
    return this.subscribersService.findAll();
  }

  @Get(':id')
  @ResponseMessage("get subcriber by id")
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(" update subcriber")
  update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto, @CurrentUser() user:IUser) {
    return this.subscribersService.update(id, updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage(" delete subcriber")
  remove(@Param('id') id: string, @CurrentUser() user:IUser) {
    return this.subscribersService.remove(id, user);
  }
}
