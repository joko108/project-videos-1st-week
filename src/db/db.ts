export type AvailableResolutions = "P144" | "P240" | "P360" |
                                   "P480" | "P720" | "P1080" |
                                   "P1440" | "P2160";

export type VideoType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: AvailableResolutions[]
};

export type DBType = { videos: VideoType[] };

// export const db: DBType = {
//     videos: [
//         {
//             id: 1,
//             title: "super_video",
//             author: "student",
//             canBeDownloaded: false,
//             minAgeRestriction: 12,
//             createdAt: "2026-09-08T12:06:53.184Z",
//             publicationDate: "2026-10-08T12:06:53.184Z",
//             availableResolutions: ["P240", "P360", "P480", "P720", "P1080"]
//         },
//         {
//             id: 2,
//             title: "just_video",
//             author: "coach",
//             canBeDownloaded: true,
//             minAgeRestriction: 18,
//             createdAt: "2026-09-15T12:06:53.184Z",
//             publicationDate: "2026-10-15T12:06:53.184Z",
//             availableResolutions: ["P240", "P360", "P480", "P720"]
//         }
//     ]
// };
export const db: DBType = {
    videos: []
};