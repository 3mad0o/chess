import type { MessageType } from '@/types/messages';

interface MessageEmojiShowProps {
  messageEmoji: MessageType;
}
export const MessageEmojiShow = ({
  messageEmoji,
}: MessageEmojiShowProps) => {
  return (
    <div className="flex items-center gap-3">
      {messageEmoji.imageUrl ? (
        <img
          src={messageEmoji.imageUrl}
          alt={messageEmoji.text}
          className="w-10 h-10 rounded-full"
        />
      ) : null}
      <p className="text-sm text-slate-200">{messageEmoji.text}</p>
    </div>
  );
}
