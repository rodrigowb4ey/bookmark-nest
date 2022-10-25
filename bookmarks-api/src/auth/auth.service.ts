import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DbService } from "src/db/db.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
    constructor(private db:DbService) {
        
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
    
            delete user.hash;
    
            return user;
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
        
        delete user.hash;
        return user;
    }
}