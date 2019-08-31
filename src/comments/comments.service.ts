import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertCommentDto } from './dto/insert-comment.dto';
import { User } from 'src/auth/user.entity';
import { Comment } from './comment.entity';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Injectable()
export class CommentsService {


    // dependency inject repo
    constructor(@InjectRepository(CommentRepository) private commentRepository: CommentRepository) { }


    async insertCommentForClipByUserId(insertCommentDto: InsertCommentDto, user: User): Promise<Comment> {
        return await this.commentRepository.userCommentsOnClip(insertCommentDto, user);
    }



    async getCommentForClipId(clip_id: number): Promise<Comment[]> {
        // find all the comments by clipId
        const comments = await this.commentRepository.find({ clipId: clip_id });

        return comments;
    }


    /*
    we only allow a user to delete his/her own commment(s)

    */
    async removeCommentForClipByUserId(deleteCommentDto: DeleteCommentDto, user: User): Promise<void> {
        //destruct dto
        const { comment_id } = deleteCommentDto;

        //delete the task using the repository
        const result = await this.commentRepository.delete({ id: comment_id, userId: user.id});
        // if we did not delete anything throw exception
        if (result.affected === 0) { // affected == the amount of rows deleted
            throw new UnauthorizedException(`User can not delete Comment ${comment_id}.`);
        }
    }



}
