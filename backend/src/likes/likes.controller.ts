import { Controller, UseGuards, Param, ParseIntPipe, Post, Get, Delete } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';

import { Like } from './like.entity';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('likes')
@UseGuards(AuthGuard()) // guard this whole controller using jwt/passport.js
// this means we will be adding the user info to each httprequest (see jwt.strategy.ts validate method)
export class LikesController {
    //dependency inject like.service.ts
    constructor(private likesService: LikesService) { }


    /*
   A user  likes a clip_id passed in the url as a parameter
  */
    @Post('/:clip_id') //custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    userLikesClip(@Param('clip_id', ParseIntPipe) clip_id: number, @GetUser() user: User): Promise<Like> {
        return this.likesService.userLikesClip(clip_id, user);

    }


    /*
    Grab all likes a user has
    user info is placed in the http request by jwt.strategy.ts
    */
    @Get() //custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    getUserLikedClips(@GetUser() user: User): Promise<Like[]> {
        return this.likesService.getUserLikesByUserId(user);
        
    }

    /*
   unlike a user from the clip_id passed in the url as a parameter
   */

    @Delete('/:clip_id')//custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    userUnlikesClip(@Param('clip_id', ParseIntPipe) clip_id: number, @GetUser() user: User): Promise<void> {
        return this.likesService.userUnlikesClip(clip_id, user);
        
    }
}
