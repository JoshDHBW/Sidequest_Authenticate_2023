import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from 'src/token/token.service';
import { Token, TokenSchema } from 'src/schemas/token.schema';
import { TokenController } from './token.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  providers: [TokenService],
  controllers: [TokenController],
  exports: [TokenService]
})
export class TokenModule {}
