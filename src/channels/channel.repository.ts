import { EntityRepository, Repository } from "typeorm";
import { Channel } from "./channel.entity";
import { CreateChannelDto } from "./dto/create-channel.dto";

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel>{

    //will use async await to save our row to the database
    async insertChannel(createChannelDto: CreateChannelDto): Promise<Channel>{
        //destruct parameters
        const {name, subsystem, location, program} = createChannelDto;

        //create Channel Entity/row
        const channel = new Channel();
        channel.name = name;
        channel.subsystem = subsystem;
        channel.location = location;
        channel.program = program;

        //save entity/row to db
        await channel.save()

        //return the channel in its entirety
        return channel;
    }

}