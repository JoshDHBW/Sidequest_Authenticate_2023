import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from 'src/schemas/token.schema';
import { User } from 'src/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { Cron, CronExpression } from '@nestjs/schedule';
const jws = require('jws');

@Injectable()
export class TokenService {

  secret: string = "cake";
  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  saveToken(token: Token) {
    const createdUser = new this.tokenModel(token);
    return createdUser.save();
  }

  findByRandomId(randomId: string) {
    return this.tokenModel.findOne({"randomId": randomId}).exec();
  }

  removeByRandomId(randomId: string) {
    return this.tokenModel.deleteOne({"randomId": randomId}).exec();
  }

  async createNewToken(user: User) {
    if (!user) {
      console.warn("Cannot create a token for an anonymous user!");
      return null;
    }
      let exp = new Date();
      exp.setDate(exp.getDate() + 1)
      let token: Token = {
          email: user.email,
          randomId: uuidv4(),
          roles: user.roles,
          exp: exp,
          iss: "vorschlagswesen-backend",
          iat: new Date(),
          firstname: user.firstname,
          lastname: user.lastname
      };
      const signedToken = jws.sign({
        header: { alg: 'HS256' },
        payload: token,
        secret: this.secret,
      });
      await this.saveToken(token);
      return signedToken;
  }

  async validateToken(tokenSigned: string) {
    if (!tokenSigned) {
      return false;
    }
    try {
      let signatureOk = jws.verify(tokenSigned, 'HS256', this.secret);
      if (signatureOk) {
        let decoded = jws.decode(tokenSigned);
        if (!decoded) {
          return false;
        } else {
          let decodedPayload = JSON.parse(decoded.payload);
          let tokenFound = await this.tokenModel.findOne({"randomId": decodedPayload.randomId}).exec();
          if (tokenFound) {
            // Check expiry date
            if (new Date().getTime() < tokenFound.exp.getTime()) {
              decodedPayload.active = true;
              return decodedPayload;
            } else {
              console.log("Token expired");
              return false;
            }
          } else {
            // If user logs out the token is not in the database anymore
            return false;
          }
        }
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  async logout(token: string) {
    if (!token) {
      console.warn("No token given to logout")
      return false;
    }
    let decoded = jws.decode(token);
      if (!decoded) {
        return false;
      } else {
        let decodedPayload = JSON.parse(decoded.payload);
        await this.removeByRandomId(decodedPayload.randomId);
        return true;
      }
  }

  @Cron(CronExpression.EVERY_WEEKEND)
  async handleCron() {
    console.log("Token Cleanup");
    let deleteTokenOlderThan = new Date();
    //Delete all token which are expired since 7 days
    deleteTokenOlderThan.setDate(deleteTokenOlderThan.getDate() - 7);
    let tokenList: Token[] = await this.tokenModel.find({"exp": {$lt: deleteTokenOlderThan}}).exec();;
    for (let token of tokenList) {
      await this.removeByRandomId(token.randomId);
    }
    console.log("Removed " + tokenList.length + " tokens");
  }
}
