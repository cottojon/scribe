import { Channel } from "./channel";

export class Clip {
  id: number;
  text: string;
  revised_text: string;
  speaker: string;
  created_at: Date;
  revised_at: Date;
  revised: boolean;
  path_to_file: string;
  channelId: number;
  channel: Channel;
}
