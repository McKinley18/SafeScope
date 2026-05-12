import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecretkey',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userId,
      email: payload.email,
      type: payload.type,
      role: payload.role,
      subscriptionStatus: payload.subscriptionStatus,
      deletedAt: payload.deletedAt,
      organizationId: payload.organizationId
    };
  }
}
