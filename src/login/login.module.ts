import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { UsersModule } from 'src/users/users.module';
import { LoginController } from './login.controller';
import { LogoutController } from './logout.controller';

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [LoginController, LogoutController],
})
export class LoginModule {}
