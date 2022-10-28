import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { DbService } from "../../db/db.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private db: DbService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        });
    };

    async validate(payload: { sub: number, email: string }) {
        const user = await this.db.user.findUnique({
            where: {
                id: payload.sub,
            },
        });

        delete user.hash;
        return user;
    };
}