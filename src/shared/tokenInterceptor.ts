import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class TokenIntercepor implements NestMiddleware {
constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        let token: string = <string> req.headers.authorization;
        if (token.includes("Bearer")) {
            token = token.split(" ")[1];
        }
        let result = await this.tokenService.validateToken(token);
        if (result.active) {
            //All routes of the authorization Server (except register user) needs the "Sachbearbeiter"-Role
            if (result.roles.includes("Sachbearbeiter")) {
                res.locals.userinfo = result;
                next();
            } else {
                res.sendStatus(HttpStatus.FORBIDDEN);
            }
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    } else {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    
  }
}
