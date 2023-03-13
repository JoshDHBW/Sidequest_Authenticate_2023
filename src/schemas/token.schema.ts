
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop()
  email: string;

  @Prop()
  randomId: string;

  @Prop()
  roles: string[];

  @Prop()
  exp: Date;

  @Prop()
  iss: String;

  @Prop()
  iat: Date;
  firstname: string;
  lastname: string
}

export const TokenSchema = SchemaFactory.createForClass(Token);
