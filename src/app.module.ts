import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from './token/token.module';
import { LoginModule } from './login/login.module';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './conf/configuration';

@Module({
  imports: [TokenModule, UsersModule, LoginModule, MongooseModule.forRoot(configuration.databaseConnection), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
