import { Clip } from "./clip";

export class ClipComment {
    id: number;
    userId: number;
    userName: string;
    clipId: number;
    create_at: Date;
    comment: string;
    clip: Clip;
    profileImage: any;
    profileImageLoaded: boolean = false;
    profileImageLoading: boolean = false;
}
