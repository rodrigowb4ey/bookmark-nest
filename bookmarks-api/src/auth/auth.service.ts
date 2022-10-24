import { Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DbService } from "src/db/db.service";
import { AuthDto } from "./dto";

@Injectable()
export class AuthService {
    constructor(private db:DbService) {
        
    }

    signup(dto: AuthDto) {
        return {msg: 'I have signed up'};
    }

    signin(dto: AuthDto) {
        return {msg: 'I have signed in'};
    }
}