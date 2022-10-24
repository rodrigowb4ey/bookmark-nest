import { Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { DbService } from "src/db/db.service";

@Injectable({})
export class AuthService {
    constructor(private db:DbService) {
        
    }

    signUp() {
        return {msg: 'I have signed up'};
    }

    signIn() {
        return {msg: 'I have signed in'};
    }
}