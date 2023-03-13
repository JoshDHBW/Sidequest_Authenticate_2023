import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {Response} from 'express';
import Loginresult from './dto/loginResult';
import Logindata from './dto/logindata';
import { User, UserDocument } from 'src/schemas/user.schema';
@Controller('login')
export class LoginController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() loginDto: Logindata, @Res({ passthrough: true }) res: Response) {
    let result = await this.usersService.login(loginDto);
    let resultBody: Loginresult;
    if (!result) {
      res.status(HttpStatus.UNAUTHORIZED);
      return res;
    } else {
      let userdata = await this.usersService.findUserWithEmail(loginDto);
      res.status(HttpStatus.OK);
      resultBody = {
        success: true,
        token: result,
        user: userdata
      }
      return resultBody;
    }
  }
}
