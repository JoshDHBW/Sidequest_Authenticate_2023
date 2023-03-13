import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import {Response} from 'express';
import Tokendata from 'src/token/dto/tokenData';
import { TokenService } from 'src/token/token.service';

@Controller('logout')
export class LogoutController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  async logout(@Body() logoutDto: Tokendata, @Res({ passthrough: true }) res: Response) {
    let result = await this.tokenService.logout(logoutDto.token);
    if (!result) {
      res.status(HttpStatus.OK);
      return result;
    } else {
      res.status(HttpStatus.OK);
      return result;
    }
  }
}
