import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Logindata from 'src/login/dto/logindata';
import { TokenService } from 'src/token/token.service';
import { User, UserDocument } from 'src/schemas/user.schema';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private tokenService: TokenService) {}

  saltRounds: number = 10;

  async create(createUserDto: User) {

    let user = await this.userModel.findOne({"email": createUserDto.email}).exec();
    if (user) {
      console.log("user with email " + createUserDto.email + " already exists!")
      return false;
    };

    createUserDto.roles = []; // No new user can assign themselves any roles

    bcrypt.hash(createUserDto.password, this.saltRounds, (err, hash) => {
      createUserDto.password = hash;
      const createdUser = new this.userModel(createUserDto);
      createdUser.save();
    });
    return true;
  }

  findAll(query: any) {
    if (query && query.firstname || query.lastname) {
      return this.userModel.find().or([
        {"firstname": query.firstname}, 
        {"lastname": query.lastname}]).exec();
    } else {
      return this.userModel.find().exec();
    }
  }

  async findUserWithEmail(loginDto: Logindata) : Promise<User>{
    let user: User = await this.userModel.findOne({"email": loginDto.email}).exec();
    if (user) {
      //user found in MongoDB
        return user;
      }else{
      return;
    }
  }

  findOne(id: string) {
    return this.userModel.findOne({"_id": id}).exec();
  }

  update(id: string, updateUserDto: User) {
    return this.userModel.updateOne({"_id": id}, updateUserDto).exec();
  }

  remove(id: string) {
    return this.userModel.deleteOne({"_id": id}).exec();
  }

  async login(loginDto: Logindata): Promise<any> {
    // Login Check with local MongoDB
    let user: User = await this.userModel.findOne({"email": loginDto.email}).exec();
    if (user) {
      //user found in MongoDB
      let result: boolean = await bcrypt.compareSync(loginDto.password, user.password);
      if (result) {
        let token = await this.tokenService.createNewToken(user)
        return token;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
