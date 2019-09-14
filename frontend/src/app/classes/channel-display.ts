import { ClipDisplay } from './clip-display';
import { Channel } from './channel';

export class ChannelDisplay {
  channel: Channel;
  clipDisplays: ClipDisplay[];

  constructor(newChannel: Channel, clips: ClipDisplay[]) {
    this.channel = newChannel;
    this.clipDisplays = clips;
  }
}
