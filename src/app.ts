import express, { type Express } from "express";
import { db } from "./db/db.js";
import cors from "cors";
import { getVideosRouter } from "./routes/videos.js";
import { getTestRouter } from "./routes/test.js";

export const app: Express = express();

app.use(express.json());
app.use(cors());

app.use('/videos', getVideosRouter(db));
app.use('/testing', getTestRouter(db));
