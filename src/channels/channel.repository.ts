import { EntityRepository, Repository } from "typeorm";
import { Channel } from "./channel.entity";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { GetChannelFilterDto } from "./dto/get-channel-filter.dto";

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



    async getChannels(channelFilterDto: GetChannelFilterDto): Promise<Channel[]>{
        //destruct the name
        const {name} = channelFilterDto;

        //we will use a queryBuilder just in case we have to get channels by name
        //this is the equivalent of actually writing out a SQL query but just using TYPEORM methods
        //our alias in our query for each channel will be 'channel'
        const query = this.createQueryBuilder('channel');

        //if the client passed in a channel name this will be defined
        if(name){
            // write a where clause, name comes from our client
            // provide an object for the second parameter that represents our variable in the where clause string
            //Like allows us to do partial matching
            //LOWER lowercases our input for us
            query.andWhere('LOWER(channel.name) LIKE LOWER(:name)', { name: `%${name}%` })
        }

        //execute the actual query
        //the query will either just be the SELECT and FROM, or SELECT,FROM,WHERE
        const channels = query.getMany();

        return channels;
    }

}