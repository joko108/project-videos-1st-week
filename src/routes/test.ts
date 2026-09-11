import express from "express";
import type {Request, Response, Router} from "express";
import {db, type DBType} from "../db/db.js";
import {HTTP_STATUSES} from "../utils.js";

export const getTestRouter = (db: DBType) => {
    const router: Router = express.Router();

    // Clear database: delete all data from all tables/collections
    router.delete('/all-data', (_req: Request, res: Response) => {
        db.videos = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
};
