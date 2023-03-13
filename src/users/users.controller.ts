import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';
import { Headers } from '@nestjs/common';
const sanitize = require('mongo-sanitize');
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(sanitize(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(sanitize(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.usersService.update(sanitize(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(sanitize(id));
  }
}
