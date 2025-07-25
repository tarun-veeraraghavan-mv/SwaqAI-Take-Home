export interface Channel {
  id: number;
  channel_id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
  subscriber_count: number;
  video_count: number;
  view_count: number;
  channel_url: string;
}

export interface ChannelListProps {
  channels: Channel[];
  onDeleteChannel: (channelId: number) => void;
}

export interface ChannelCardProps {
  channel: Channel;
  onDeleteChannel: (channelId: number) => void;
}

export interface AddChannelFormProps {
  onAddChannels: (channel: Channel) => void;
}
