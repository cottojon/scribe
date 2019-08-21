import { Repository, Entity, EntityRepository, RelationQueryBuilder } from "typeorm";
import { Clip } from "./clip.entity";
import { CreateClipDto } from "./dto/create-clip.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelRepository } from "src/channels/channel.repository";
import { Channel } from "src/channels/channel.entity";


@EntityRepository(Clip)
export class ClipRepository extends Repository<Clip>{

    //inject the channel repository
    constructor(@InjectRepository(ChannelRepository) private channelRepository: ChannelRepository){
        super();
    }


    async createClip(createClipDto: CreateClipDto): Promise<Clip>{
        //destruct dto
        const {channel_id, text, path_to_file, speaker} = createClipDto;

        const query =  await this.createQueryBuilder();

        //find the channel 
        //const channel = this.channelRepository.findOne({id: channel_id});

        //create clip
        const clip = new Clip();
        clip.text = text;
        clip.path_to_file = path_to_file;
        clip.speaker = speaker;

      
        await query.relation(Clip, "channel").of(clip).set(channel_id);



        return clip;

    }

}