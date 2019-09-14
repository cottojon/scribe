import { Clip } from './clip';

export class ClipDisplay {
  clip: Clip;
  editing: boolean;
  channel_name: string;
  created_at: Date;

  constructor(newClip: Clip, ChannelName: string) {
    this.clip = newClip;
    this.editing = false;
    this.channel_name = ChannelName;
    this.created_at = new Date(newClip.created_at);
  }
}
