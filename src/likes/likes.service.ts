import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';
import { Like } from './like.entity';
import { User } from '../auth/user.entity';
import { Clip } from 'src/clips/clip.entity';

@Injectable()
export class LikesService {
    //dependency inject like repository
    constructor(@InjectRepository(LikeRepository) private likeRepository: LikeRepository){}
    

    async userLikesClip(clip_id: number, user: User): Promise<Like>{
        return await this.likeRepository.userLikesClip(clip_id, user);
    }



    async getUserLikesByUserId(user: User): Promise<Like[]>{
        //find all the likes by userId
        const likes = await this.likeRepository.find({ userId: user.id });

        return likes;
    }


    async userUnlikesClip(clip_id: number, user: User): Promise<void>{
        //delete the task using the repository
        const result = await this.likeRepository.delete({ clipId: clip_id, userId: user.id });
        // if we did not delete anything throw exception
        if (result.affected === 0) { // affected == the amount of rows deleted
            throw new NotFoundException(`Clip with ID ${clip_id} not found`);
        }
    }
}
