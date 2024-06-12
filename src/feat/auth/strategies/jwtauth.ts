import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET,
        });
      }

    async validate(payload: any) {
        this.logger.log('Entering validate method');
        if (!payload) {
            console.log('No payload');
        }
        return { userId: payload.sub, username: payload.username, role: payload.role};
    }
}
