import { Injectable, ForbiddenException } from "@nestjs/common";
import { DbService } from "../db/db.service";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@Injectable()
export class BookmarkService {
    constructor(private db: DbService) {

    };

    getBookmarks(userId: number) {
        return this.db.bookmark.findMany({
            where: {
                userId,
            }
        });
    };

    getBookmarkById(userId: number, bookmarkId: number) {
        return this.db.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            }
        });
    };

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.db.bookmark.create({
            data: {
                userId,
                ...dto,
            },
        });

        return bookmark;
    };

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.db.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });

        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Acces to resources denied');
        };

        return this.db.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            },
        });
    };

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.db.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Acces to resources denied');
        };

        await this.db.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });
    }
};