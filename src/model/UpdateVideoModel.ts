import type { AvailableResolutions } from "../db/db.js";

export type UpdateVideoModel = {
    title: string;
    author: string;
    availableResolutions: AvailableResolutions[];
    canBeDownloaded: boolean;
    minAgeRestriction:  number | null;
    publicationDate: string
};
