import { Clip } from './clip';

export class ClipDisplay {
  clip: Clip;
  editing: boolean;
  isRevised: boolean;
  displayingOriginalText: boolean;
  channel_id: number;
  created_at: Date;
  displayed_text: string;

  constructor(newClip: Clip, channelId: number) {
    this.clip = newClip;
    this.editing = false;
    this.channel_id = channelId;
    this.created_at = new Date(newClip.created_at);
    this.isRevised = !(newClip.revised_text === undefined || newClip.revised_text === '' || newClip.revised_text === null);
    this.displayingOriginalText = !this.isRevised;
    this.displayed_text = (this.isRevised) ? newClip.revised_text : newClip.text;
  }
}
