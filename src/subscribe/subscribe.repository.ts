import { Repository, EntityRepository } from "typeorm";
import { Subscribe } from "./subscribe.entity";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { User } from "../auth/user.entity";



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
            }else{
                throw new InternalServerErrorException('Database Error');

            }
        }


        return subscribe;
    }

}