import type { CreateVideoModel } from "./model/CreateNewModel.js";
import type { UpdateVideoModel } from "./model/UpdateVideoModel.js";
import {type AvailableResolutions, validResolutions} from "./db/db.js";

type ValidationError = { message: string; field: string};

const validateTitle = (title: string | undefined): ValidationError[] => {
    if (!title || title.trim() === "") {
        return [{ message: "title is required", field: "title" }];
    } else if (title.length > 40) {
        return [{ message: "title is too long", field: "title" }];
    }
    return [];
};

const validateAuthor = (author: string | undefined): ValidationError[] => {
    if (!author || author.trim() === "") {
        return [{ message: "author is required", field: "author" }];
    } else if (author.length > 20) {
        return [{ message: "author's name is too long", field: "author" }];
    }

    return [];
};

const validateResolution = (resolution: AvailableResolutions[] | undefined): ValidationError[] => {
    if (!resolution || resolution.length === 0) {
        return [{ message: "availableResolutions is required", field: "availableResolutions" }];
    }

    for (let item of resolution) {
        if (!validResolutions.includes(item)) {
            return [{ message: "invalid availableResolutions", field: "availableResolutions" }];
        }
    }

    return [];
};

const validateCanBeDownloaded = (value: boolean | undefined): ValidationError[] => {
    if (typeof value !== "boolean") {
        return [{ message: "canBeDownloaded is required", field: "canBeDownloaded" }];
    }
    return [];
};

const validateMinAgeRestriction = (age: number | null | undefined): ValidationError[] => {
    if (age === undefined) {
        return [{ message: "minAgeRestriction is required", field: "minAgeRestriction" }];
    } else if (age !== null) {
        if (age < 1 || age > 18) {
            return [{ message: "Invalid minimal age (1-18)", field: "minAgeRestriction" }];
        }
    }
    return [];
};

const validatePublicationDate = (date: string | undefined): ValidationError[] => {
    if (!date || date.trim() === "") {
        return [{ message: "publicationDate is required", field: "publicationDate" }];
    }

    const validDate = new Date(date);
    if (!validDate.toISOString()) {
        return [{ message: "invalid publicationDate", field: "publicationDate" }];
    }

    return [];
};

export const validateCreateVideo = (data: CreateVideoModel): ValidationError[] => {
    return [
        ...validateTitle(data.title),
        ...validateAuthor(data.author),
        ...validateResolution(data.availableResolutions)
    ];
};

export const validateUpdateVideo = (data: UpdateVideoModel): ValidationError[] => {
    return [
        ...validateTitle(data.title),
        ...validateAuthor(data.author),
        ...validateResolution(data.availableResolutions),
        ...validateCanBeDownloaded(data.canBeDownloaded),
        ...validateMinAgeRestriction(data.minAgeRestriction),
        ...validatePublicationDate(data.publicationDate)
    ];
};
