import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
export type payload = {
  sub: number;
  email: string;
};
@Injectable()
export class AtJTW extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'at-secret',
    });
  }
  validate(payload: payload) {
    return payload;
  }
}
