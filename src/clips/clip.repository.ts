import { Repository, Entity, EntityRepository, RelationQueryBuilder } from "typeorm";
import { Clip } from "./clip.entity";
import { CreateClipDto } from "./dto/create-clip.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelRepository } from "src/channels/channel.repository";
import { Channel } from "src/channels/channel.entity";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { GetClipFilterDto } from "./dto/get-clip-filter.dto";


@EntityRepository(Clip)
export class ClipRepository extends Repository<Clip>{

    //inject the channel repository
    constructor(@InjectRepository(ChannelRepository) private channelRepository: ChannelRepository) {
        super();
    }


    async createClip(createClipDto: CreateClipDto, channel_id: number): Promise<Clip> {
        //destruct dto
        const { text, path_to_file, speaker } = createClipDto;

        //create clip
        const clip = new Clip();
        clip.text = text;
        clip.path_to_file = path_to_file;
        clip.speaker = speaker;
        clip.channelId = channel_id;
        clip.revised = false;

        var clip2;

        try {
             clip2 = await clip.save();

        } catch (error) {
            // channel_id does not belong to a channel thus it does not exist
            if(error.code === '23503'){
                throw new NotFoundException(`Channel ${channel_id} does not exist`);
            }else{ // probably due to non null column insertions or database connection drop
                throw new InternalServerErrorException('Could not insert into database');
            }
        }

        return clip2;

    }

    /*
    This method can achieve get clips from the search criteria in the getClipsFilterDto of
    If the getClipsFilterDto is completely empty we will just end up getting all the clips in the database

    */
    async getClips(getClipsFilterDto: GetClipFilterDto): Promise<Clip[]>{
        //destruct dto
        const {channel_id, channel_name, text, speaker, start_date, end_date} = getClipsFilterDto;

        //let us create a query builder with alias clip, this alias will be used within our query to refer to our clip entity in the where clauses
        const query = this.createQueryBuilder('clip');
        //inner join and select with the channel so we grab the channel row with each clip row
        //the first argument is the relation we want to ladd, the second argument is the alias we will be using
        query.innerJoinAndSelect("clip.channel", "channel");



        //if the client has provided us with search criteria to filter our clips these will be defined
        // we just keep on adding andWhere clauses to the query inside of these if statements
        if(text){
            // sql LIKE allows for partial matches
            // LOWER is used to lowercase the string
            query.andWhere('LOWER(clip.text) LIKE LOWER(:text)', {text: `%${text}%`}) //to use partial matching we have to wrap our search term in %
        }


        if(speaker){
            query.andWhere('LOWER(clip.speaker) LIKE LOWER(:speaker)', {speaker: `%${speaker}%`});
        }



        if(channel_id){
            query.andWhere('clip.channelId = :channel_id', {channel_id});
        }

        if(channel_name){
            query.andWhere('LOWER(channel.name) LIKE LOWER(:channel_name)', {channel_name: `%${channel_name}%`});
        }


        // execute the query
        const clips = await query.getMany();



        return clips;

    }


}