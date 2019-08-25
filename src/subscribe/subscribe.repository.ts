import { Repository, EntityRepository } from "typeorm";
import { Subscribe } from "./subscribe.entity";
import { User } from "src/auth/user.entity";
import { NotFoundException } from "@nestjs/common";



@EntityRepository(Subscribe)
export class SubscribeRepository extends Repository<Subscribe>{




    async subscribeUserToChannel(channel_id: number, user: User): Promise<Subscribe> {
        //create a subscribe column
        var subscribe = new Subscribe();
        subscribe.channelId = channel_id;
        subscribe.userId = user.id;


        try {
            //save the subscribe column to database

            subscribe = await subscribe.save();

        } catch (error) {

            //channel_id does not exist
            if (error.code === '23503') {
                throw new NotFoundException(`Channel ${channel_id} does not exist`);
            }
        }


        return subscribe;
    }

}