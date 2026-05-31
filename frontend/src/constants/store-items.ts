import type { StoreItem } from "@/types/store";

export const storeItems:StoreItem[] = [
  {
    id: 1,
    name: "Smug Monarch",
    price: 49.99,
    imageUrl: "/smug-monarch.png",
    text:'WELL PLAYED',
    soundUrl:''
  },
  {
    id: 2,
    name: "Panic Pawn",
    price: 39.99,
    imageUrl: "/panic-pawn.png",
    text:'OH NO!',
    soundUrl:'/sounds/oh_no.mp3'
  },
  {
    id: 3,
    name: "Genius Gambit",
    price: 29.99,
    imageUrl: "/genuis-gambit.png",
    text:'BRILLIANT',
    soundUrl:''
  },
  {
    id: 4,
    name: "Skeptical Rook",
    price: 19.99,
    imageUrl: "/skeptical-rook.png",
    text:'HMM...',
    soundUrl:''
  }
]