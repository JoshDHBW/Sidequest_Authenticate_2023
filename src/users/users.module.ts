import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TokenService } from 'src/token/token.service';
import { Token, TokenSchema } from 'src/schemas/token.schema';
import { TokenModule } from 'src/token/token.module';
import { TokenIntercepor } from 'src/shared/tokenInterceptor';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), TokenModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenIntercepor).exclude({ path: 'authentication-srv/users/', method: RequestMethod.POST }).forRoutes(UsersController)
  }
}
