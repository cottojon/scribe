import { Repository, EntityRepository } from "typeorm";
import { User } from "src/auth/user.entity";
import { NotFoundException } from "@nestjs/common";
import { Like } from './like.entity';



@EntityRepository(Like)
export class LikeRepository extends Repository<Like>{




    async userLikesClip(clip_id: number, user: User): Promise<Like> {
        //create a Like column
        var like = new Like();
        like.clipId = clip_id;
        like.userId = user.id;


        try {
            //save the like column to database

            like = await like.save();

        } catch (error) {

            //clip_id does not exist
            if (error.code === '23503') {
                throw new NotFoundException(`Channel ${clip_id} does not exist`);
            }
        }


        return like;
    }

}