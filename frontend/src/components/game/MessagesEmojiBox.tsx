import type { MessageType } from '@/types/messages'

const messages: MessageType[] = [
  {
    text: "Game started: White opens with 1. e4",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "Black responds with 1... e5",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "2. Nf3 attacking the pawn",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "2... Nc6 defending e5",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "3. Bb5 - Ruy Lopez opening begins",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "Castling for safety: 3... Nf6 4. O-O",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "Middlegame: both sides develop pieces and control center",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "Tactical exchange in the center, tension increases",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "Endgame approaching: queens are traded",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  },
  {
    text: "Checkmate delivered! White wins the game.",
    imageUrl: "https://images.chesscomfiles.com/chess-themes/boards/green/150.png"
  }
];
export const MessagesEmojiBox = () => {
  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Emoji clicked!");
    console.log("Event details:", e);

  }
  return (
    <div className='grid grid-cols-2 overflow-y-auto gap-4 p-4 max-h-64'>
      {
        messages.map((message,index) => (
          <div 
          onClick={handleOnClick}
          key={index} className='flex flex-col items-center gap-2 hover:border rounded-md p-2 border-[#50C878]'>
            <img src={message.imageUrl} alt={`Message ${index + 1}`} className='w-12 h-12 rounded-full' />
            <p className='text-sm text-center'>{message.text}</p>
          </div>
        ))
      }

    </div>
  )
}
