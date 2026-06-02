export type StoreItemType = 'board' | 'sticker'

export type StoreItem = {
  id: number
  type: StoreItemType
  name: string
  price: number
  imageUrl: string
  description?: string
  // For stickers
  text?: string 
  soundUrl?: string
}