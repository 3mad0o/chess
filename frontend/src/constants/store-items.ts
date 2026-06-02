import type { StoreItem } from "@/types/store";

export const storeItems: StoreItem[] = [
  // Stickers
  {
    id: 1,
    type: 'sticker',
    name: "Smug Monarch",
    price: 49.99,
    imageUrl: "/smug-monarch.png",
    text: 'WELL PLAYED',
    soundUrl: ''
  },
  {
    id: 2,
    type: 'sticker',
    name: "Panic Pawn",
    price: 39.99,
    imageUrl: "/panic-pawn.png",
    text: 'OH NO!',
    soundUrl: '/sounds/oh_no.mp3'
  },
  {
    id: 3,
    type: 'sticker',
    name: "Genius Gambit",
    price: 29.99,
    imageUrl: "/genuis-gambit.png",
    text: 'BRILLIANT',
    soundUrl: ''
  },
  {
    id: 4,
    type: 'sticker',
    name: "Skeptical Rook",
    price: 19.99,
    imageUrl: "/skeptical-rook.png",
    text: 'HMM...',
    soundUrl: ''
  },
  // Boards
  {
    id: 5,
    type: 'board',
    name: "Marble & Obsidian",
    price: 99.99,
    imageUrl: "/store/marble_and_obsiden.png",
    description: "A cold, monolithic aesthetic for the calculating player."
  },
  {
    id: 6,
    type: 'board',
    name: "Classic Wood",
    price: 79.99,
    imageUrl: "/store/classic_wood.png",
    description: "The traditional atmosphere of a grandmaster's study."
  },
  {
    id: 7,
    type: 'board',
    name: "Arctic Silver",
    price: 89.99,
    imageUrl: "/store/arctic_silver.png",
    description: "Sleek, futuristic precision with brushed metallic finishes."
  }
]