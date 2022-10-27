import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config'
import { JwtService } from "@nestjs/jwt";
import { User, Bookmark } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { DbService } from "src/db/db.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";

@Injectable()
export class AuthService {
    constructor(
        private db:DbService, 
        private jwt: JwtService,
        private config: ConfigService,
    ) {
        
    }

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);

        try {
            const user = await this.db.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });
    
            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                };
            };
            throw error;
        };

    };

    async signin(dto: AuthDto) {
        const user = await this.db.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) {
            throw new ForbiddenException(
                'Credentials incorrect.'
            );
        };

        const passwordMatches = await argon.verify(user.hash, dto.password);

        if (!passwordMatches) {
            throw new ForbiddenException(
                'Credentials incorrect.'
            );
        };
        
        return this.signToken(user.id, user.email);
    };

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email,
        };

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });

        return {
            access_token: token,
        }; 
    };
}