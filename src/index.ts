import express from 'express';
import type { Request, Response } from "express";
import cors from 'cors';
import { HTTP_STATUSES } from "./utils.js";
import { db } from "./db/db.js";
import type { VideoType } from "./db/db.js";
import type { CreateVideoModel } from "./model/CreateNewModel.js";
import type { URIParamsVideoModel } from "./model/URIParamsVideoModel.js";
import type { RequestWithParams, RequestWithParamsAndBody, RequestWithBody } from "./types.js";
import type { ErrorsMessagesModel } from "./model/ErrorsMessagesModel.js";
import type { UpdateVideoModel } from "./model/UpdateVideoModel.js";
import { validateCreateVideo, validateUpdateVideo } from "./validation.js";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

// Return all videos
app.get('/videos', (_req: Request, res: Response<VideoType[]>) => {
    let foundVideos = db.videos;

    res.status(HTTP_STATUSES.OK_200).json(foundVideos);
});

// Return video by ID
app.get('/videos/:id', (req: RequestWithParams<URIParamsVideoModel>,
                        res: Response<VideoType>) => {
    const foundVideo = db.videos.find(v => v.id === +req.params.id);
    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.status(HTTP_STATUSES.OK_200).json(foundVideo);
});

// Create new video
app.post('/videos', (req: RequestWithBody<CreateVideoModel>,
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
app.put('/videos/:id', (req: RequestWithParamsAndBody<URIParamsVideoModel, UpdateVideoModel>,
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
app.delete('/videos/:id', (req: RequestWithParams<URIParamsVideoModel>,
                          res: Response) => {
    if (!req.params.id) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    db.videos = db.videos.filter(v => v.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// Clear database: delete all data from all tables/collections
app.delete('/testing/all-data', (_req: Request, res: Response) => {
   db.videos = [];
   res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// Start server
app.listen(PORT, () => {
    console.log(`Example app listening on ${PORT}`);
});
