import type { AvailableResolutions } from "../db/db.js";

export type CreateVideoModel = {
    title: string;
    author: string;
    availableResolutions: AvailableResolutions[]
};
