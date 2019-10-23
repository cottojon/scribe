import { Controller, UseGuards, Post, Param, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscribeService } from './subscribe.service';

import { Subscribe } from './subscribe.entity';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('subscribe')
@UseGuards(AuthGuard()) // guard this whole controller using jwt/passport.js
// this means we will be adding the user info to each httprequest (see jwt.strategy.ts validate method)
export class SubscribeController {
    //dependency inject subscribe service
    constructor(private subscribeService: SubscribeService) { }


    /*
    Subscribe a user to the channel_id passed in the url as a parameter
    */
    @Post('/:channel_id') //custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    subscribeUserToChannel(@Param('channel_id', ParseIntPipe) channel_id: number, @GetUser() user: User): Promise<Subscribe> {
        return this.subscribeService.subscribeUserToChannel(channel_id, user);
    }


    /*
    Grab all channels a user is subscribed to
    user info is placed in the http request by jwt.strategy.ts
    */
    @Get() //custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    getUserSubscribedChannels(@GetUser() user: User): Promise<Subscribe[]> {
        return this.subscribeService.getUserSubscribedChannels(user);
    }

    /*
   unsubscribe a user from the channel_id passed in the url as a parameter
   */

    @Delete('/:channel_id')//custom decorator @GetUser() grabs our user from the httprequest placed by jwt.strategy.ts
    unsubscribeUserFromChannel(@Param('channel_id', ParseIntPipe) channel_id: number, @GetUser() user: User): Promise<void> {
        return this.subscribeService.unsubscribeUserToChannel(channel_id, user);

    }


}
