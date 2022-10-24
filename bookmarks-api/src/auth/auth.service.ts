import { Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DbService } from "src/db/db.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";

@Injectable()
export class AuthService {
    constructor(private db:DbService) {
        
    }

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);

        const user = await this.db.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });

        delete user.hash;

        return user;
    }

    signin(dto: AuthDto) {
        return {msg: 'I have signed in'};
    }
}