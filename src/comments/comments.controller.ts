import { Controller, UseGuards, Post, ValidationPipe, Body, Get, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { InsertCommentDto } from './dto/insert-comment.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { Comment } from './comment.entity';
import { User } from 'src/auth/user.entity';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Controller('comments')
@UseGuards(AuthGuard()) // guard this whole controller using jwt/passport.js
// this means we will be adding the user info to each httprequest (see jwt.strategy.ts validate method)
export class CommentsController {
    //dependency inject service
    constructor(private commentsService: CommentsService) { }

    /*
   A user leaves a comment on clip_id passed in the body
  */
    @Post() //custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    insertComentForClipByUserId(@Body(ValidationPipe) insertCommentDto: InsertCommentDto, @GetUser() user: User): Promise<Comment> {
        return this.commentsService.insertCommentForClipByUserId(insertCommentDto, user);

    }


    /*
    Grab all comments a clip_id has
    */
    @Get('/clip_id') //custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    getCommentForClipId(@Param('clip_id', ParseIntPipe) clip_id: number): Promise<Comment[]> {
        return this.commentsService.getCommentForClipId(clip_id);

    }

    /*
    Delete a comment from clip id from a user
    */

    @Delete()//custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    removeCommentForClipByUserId(@Body(ValidationPipe) deleteCommentDto: DeleteCommentDto, @GetUser() user: User): Promise<void> {
        return this.commentsService.removeCommentForClipByUserId(deleteCommentDto, user);

    }
}
