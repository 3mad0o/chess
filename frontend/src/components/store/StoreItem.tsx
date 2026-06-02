import { useEffect, useRef, useState } from 'react'
import type { StoreItem as StoreItemType } from '@/types/store'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Check, Volume2 } from 'lucide-react'

type StoreItemProps = {
  item: StoreItemType
  isSelected?: boolean
  onToggle?: (item: StoreItemType) => void
}

export const StoreItem = ({ item, isSelected, onToggle }: StoreItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [localSelected, setLocalSelected] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canPreviewSound = Boolean(item.soundUrl)
  const selected = isSelected ?? localSelected
  const itemTypeLabel = item.type === 'board' ? 'Board theme' : 'Sticker'

  const formattedPrice = `${item.price.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} CP`
  const priceAmount = item.price.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const playPreview = async () => {
    if (isPlaying || !item.soundUrl) {
      return
    }

    audioRef.current?.pause()
    setIsPlaying(true)

    const audio = new Audio(item.soundUrl)
    audioRef.current = audio

    const stopPreview = () => setIsPlaying(false)
    audio.addEventListener('ended', stopPreview, { once: true })
    audio.addEventListener('pause', stopPreview, { once: true })

    try {
      await audio.play()
    } catch {
      setIsPlaying(false)
    }
  }

  const toggleItem = () => {
    setLocalSelected(current => !current)
    onToggle?.(item)
  }

  return (
    <Card
      className={`relative gap-0 rounded-lg border bg-card p-0 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg ${
        selected ? 'border-primary/60 ring-2 ring-primary/25' : 'border-border'
      }`}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted/45">
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 h-6 rounded-md bg-background/85 px-2 text-[0.7rem] font-semibold text-foreground shadow-sm"
        >
          {itemTypeLabel}
        </Badge>

        {selected ? (
          <span className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Check className="size-4" />
          </span>
        ) : null}

        <div className="flex size-full items-center justify-center p-6">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="max-h-32 w-auto max-w-[72%] rounded-lg object-contain transition duration-300 group-hover/card:scale-[1.04]"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-20">
          <h3 className="text-base font-semibold leading-tight text-foreground">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {item.description ?? item.text ?? 'A quick expression for tense chess moments.'}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border bg-muted/50 px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Cost</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <img
              src="/store/one_coin.png"
              alt=""
              className={`size-5 object-contain drop-shadow-sm group-hover/card:animate-store-coin-spin ${
                selected ? 'animate-store-coin-spin' : ''
              }`}
            />
            {priceAmount} CP
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          {canPreviewSound ? (
            <Button
              variant="outline"
              size="icon"
              onClick={playPreview}
              aria-label={`Preview ${item.name} sound`}
              title={isPlaying ? 'Playing preview' : 'Preview sound'}
              className="rounded-md"
            >
              <Volume2 className={`size-4 transition ${isPlaying ? 'animate-pulse text-primary' : ''}`} />
            </Button>
          ) : null}

          <Button
            variant="default"
            size="lg"
            onClick={toggleItem}
            className="h-10 flex-1 rounded-md px-3 text-sm font-semibold"
            aria-pressed={selected}
            aria-label={`${selected ? 'Remove' : 'Add'} ${item.name} for ${formattedPrice}`}
          >
            {selected ? (
              <Check className="size-4" />
            ) : (
              <img src="/store/one_coin.png" alt="" className="size-5 object-contain group-hover/button:animate-store-coin-spin" />
            )}
            <span>{selected ? 'Added' : `Add for ${formattedPrice}`}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
