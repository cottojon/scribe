import { Controller, UseGuards, Post, Param, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscribeService } from './subscribe.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Subscribe } from './subscribe.entity';

@Controller('subscribe')
@UseGuards(AuthGuard()) // guard this whole controller using jwt/passport.js
                        // this means we will be adding the user info to each httprequest (see jwt.strategy.ts validate method)
export class SubscribeController {
    //dependency inject subscribe service
    constructor(private subscribeService: SubscribeService){}


    /*
    Subscribe a user to the channel_id passed in the url as a parameter
    */
    @Post('/:channel_id') //custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    subscribeUserToChannel(@Param('channel_id', ParseIntPipe) channel_id: number, @GetUser() user: User): Promise<Subscribe>{
        return this.subscribeService.subscribeUserToChannel(channel_id, user);
    }



    @Get()
    getUserSubscribedChannels(@GetUser() user: User){
        console.log(user);
    }



    @Delete('/:channel_id')
    unsubscribeUserFromChannel(@Param('channel_id', ParseIntPipe) channel_id: number, @GetUser() user: User){
        console.log(channel_id);
        console.log(user);
    }


}
