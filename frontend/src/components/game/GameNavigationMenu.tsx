
import { BsChatDots } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import { MessagesEmojiBox } from "./MessagesEmojiBox";

export const GameNavigationMenu = () => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full flex justify-center pb-4">
      <Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <BsChatDots />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-96">
      <MessagesEmojiBox />
  </PopoverContent>
</Popover>
    </div>
  );
};