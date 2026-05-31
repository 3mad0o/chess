import { useState } from 'react'
import type { StoreItem as StoreItemType } from '@/types/store'
import { Link } from 'react-router'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { VscTriangleRight } from 'react-icons/vsc'
import { Volume2 } from 'lucide-react'

export const StoreItem = ({ item }: { item: StoreItemType }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const playPreview = async () => {
    if (isPlaying) {
      return
    }

    setIsPlaying(true)

    if (item.soundUrl) {
      const audio = new Audio(item.soundUrl)
      audio.addEventListener('ended', () => setIsPlaying(false))
      audio.addEventListener('pause', () => setIsPlaying(false))

      try {
        await audio.play()
      } catch {
        setIsPlaying(false)
      }

      return
    }

    try {
      const AudioContextConstructor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

      if (!AudioContextConstructor) {
        setIsPlaying(false)
        return
      }

      const audioCtx = new AudioContextConstructor()
      const oscillator = audioCtx.createOscillator()
      const gain = audioCtx.createGain()

      oscillator.type = 'triangle'
      oscillator.frequency.value = 520
      oscillator.connect(gain)
      gain.connect(audioCtx.destination)
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.13, audioCtx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18)

      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.2)
      oscillator.onended = () => {
        audioCtx.close().finally(() => setIsPlaying(false))
      }
    } catch {
      setIsPlaying(false)
    }
  }

  return (
    <Card className="group/card relative overflow-hidden rounded-xl border border-white/10 bg-neutral-950/90 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
      <div className="relative mb-4 overflow-hidden rounded-3xl bg-linear-to-br from-[#212431] via-[#181b25] to-[#0f121a] p-6 shadow-inner shadow-black/20">
        <span className="pointer-events-none absolute left-4 top-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-white/70 shadow-sm backdrop-blur-sm">
          {item.text}
        </span>

        <div className="flex h-44 items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-28 h-28 rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-500 ease-out hover:-translate-y-1 hover:scale-[1.08] hover:shadow-[0_24px_80px_rgba(0,0,0,0.32)] animate-item-bounce"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{item.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">CP {item.price.toFixed(2)}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={playPreview} aria-label="Preview sound">
              <Volume2 className={`size-4 transition ${isPlaying ? 'animate-pulse text-primary' : ''}`} />
            </Button>
            <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {isPlaying ? 'Listening...' : 'Sound preview'}
            </span>
          </div>

          <Button variant="default" size="sm" asChild>
            <Link to={`/store/${item.id}`} className="inline-flex items-center gap-2">
              View item <VscTriangleRight />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
