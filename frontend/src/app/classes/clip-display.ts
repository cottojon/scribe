import { Clip } from './clip';

export class ClipDisplay {
  clip: Clip;
  editing: boolean;
  channel_id: number;
  created_at: Date;

  constructor(newClip: Clip, channelId: number) {
    this.clip = newClip;
    this.editing = false;
    this.channel_id = channelId;
    this.created_at = new Date(newClip.created_at);
  }
}
