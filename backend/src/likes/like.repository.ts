import { Repository, EntityRepository } from "typeorm";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { Like } from './like.entity';
import { User } from "../auth/user.entity";



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
                throw new NotFoundException(`Clip ${clip_id} does not exist`);
            }else{
                throw new InternalServerErrorException('Database Error');
            }
        }


        return like;
    }

}