import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import {Response} from 'express';
import Tokendata from './dto/tokenData';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post("introspect")
  async validateToken(@Body() signedToken: Tokendata, @Res() res: Response) {
    if (signedToken && signedToken.token) {
      let decoded = await this.tokenService.validateToken(signedToken.token);
      if (decoded && decoded.active) {
        res.status(HttpStatus.OK);
        res.json(decoded);
      } else {
        res.status(HttpStatus.UNAUTHORIZED);
        res.json(false);
      }
    } else {
      res.json(false);
    }
  }
}