import express, {type Router} from 'express';
import type { Request, Response } from "express";
import type {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types.js";
import type {URIParamsVideoModel} from "../model/URIParamsVideoModel.js";
import {type DBType, type VideoType} from "../db/db.js";
import {HTTP_STATUSES} from "../utils.js";
import {validateCreateVideo, validateUpdateVideo} from "../validation.js";
import type {ErrorsMessagesModel} from "../model/ErrorsMessagesModel.js";
import type {CreateVideoModel} from "../model/CreateNewModel.js";
import type {UpdateVideoModel} from "../model/UpdateVideoModel.js";

export const getVideosRouter = (db: DBType) => {
    const router: Router = express.Router();

    // Return all videos
    router.get('/videos', (_req: Request, res: Response<VideoType[]>) => {
        let foundVideos = db.videos;

        res.status(HTTP_STATUSES.OK_200).json(foundVideos);
    });

    // Return video by ID
    router.get('/videos/:id', (req: RequestWithParams<URIParamsVideoModel>,
                               res: Response<VideoType>) => {
        const foundVideo = db.videos.find(v => v.id === +req.params.id);
        if (!foundVideo) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(HTTP_STATUSES.OK_200).json(foundVideo);
    });

    // Create new video
    router.post('/videos', (req: RequestWithBody<CreateVideoModel>,
                            res: Response<VideoType | ErrorsMessagesModel>) => {

        const errors = validateCreateVideo(req.body);
        if (errors.length > 0) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: errors });
            return;
        }

        const now = new Date();
        const createdAt = now.toISOString();
        const tomorrow = new Date(createdAt);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const publicationDate = tomorrow.toISOString();

        const createVideo: VideoType = {
            id: Date.now(),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt,
            publicationDate: publicationDate,
            availableResolutions: req.body.availableResolutions
        };

        db.videos.push(createVideo);
        res.status(HTTP_STATUSES.CREATED_201).json(createVideo);
    });

    // Update existing video by ID with inputModel
    router.put('/videos/:id', (req: RequestWithParamsAndBody<URIParamsVideoModel, UpdateVideoModel>,
                               res: Response<ErrorsMessagesModel>) => {

        const errors = validateUpdateVideo(req.body);
        if (errors.length > 0) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: errors });
            return;
        }

        const index = db.videos.findIndex(v => v.id === +req.params.id);
        if (index === -1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        db.videos[index] = { ...db.videos[index], ...req.body } as VideoType;
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    // Delete video specified by ID
    router.delete('/videos/:id', (req: RequestWithParams<URIParamsVideoModel>,
                                  res: Response) => {
        if (!req.params.id) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const index = db.videos.findIndex(v => v.id === +req.params.id);
        if (index === -1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        db.videos = db.videos.filter(v => v.id !== +req.params.id);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
};
