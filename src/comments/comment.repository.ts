import { Repository, EntityRepository } from "typeorm";
import { Comment } from './comment.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { InsertCommentDto } from './dto/insert-comment.dto';
import { User } from "src/auth/user.entity";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";


@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment>{

    async userCommentsOnClip(insertCommentDto: InsertCommentDto, user: User): Promise<Comment> {
        //destruct dto
        const {text, clip_id} = insertCommentDto;
        
        //create a comment column
        var comment = new Comment();
        comment.clipId = clip_id;
        comment.userId = user.id;
        comment.comment = text;


        try {
            //save the like column to database

            comment = await comment.save();

        } catch (error) {

            //clip_id  or user _id does not exist
            if (error.code === '23503') {
                throw new NotFoundException(`Clip ${clip_id} does not exist and/or User does not exist`);
            }else{
                throw new InternalServerErrorException('Database Error');
            }
        }


        return comment;
    }


}