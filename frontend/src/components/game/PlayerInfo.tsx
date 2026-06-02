import type { Player } from '@/types/player'
import { Card } from '../ui/card'
import { RiTimerLine } from 'react-icons/ri'

const roleStyles = {
  primary: {
    badge: 'bg-primary/10 text-primary border border-primary/20',
    card: 'border-primary/50 ring-primary/10',
    accent: 'text-primary',
  },
  secondary: {
    badge: 'bg-secondary/10 text-secondary border border-secondary/20',
    card: 'border-secondary/50 ring-secondary/10',
    accent: 'text-secondary',
  },
} as const

interface PlayerInfoProps {
  player: Player
  timeLeft: string
  isMe?: boolean
  role?: 'primary' | 'secondary'
}

export const PlayerInfo = ({
  player,
  timeLeft,
  isMe = false,
  role = 'secondary',
}: PlayerInfoProps) => {
  const styles = roleStyles[role]
  const roleLabel = role === 'primary' ? 'Primary' : 'Secondary'

  return (
    <Card
      className={`
        w-full
        max-h-[170px]
        overflow-hidden
        rounded-2xl
        border
        bg-slate-950/90
        p-2 sm:p-3
        shadow-lg
        backdrop-blur-md
        ${styles.card}
      `}
    >
      <div className="flex flex-col gap-2 sm:gap-2.5">

        {/* HEADER */}
        <div className="flex items-center gap-2.5">
          <img
            src={player.avatar}
            alt={player.name}
            className="
              h-10 w-10
              sm:h-11 sm:w-11
              rounded-xl
              border border-white/10
              object-cover
              shadow-md
              shrink-0
            "
          />

          <div className="min-w-0 flex-1">
            {/* badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span
                className={`
                  px-2 py-0.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-widest
                  rounded-full
                  ${styles.badge}
                `}
              >
                {roleLabel}
              </span>

              <span className="px-2 py-0.5 text-[9px] rounded-full bg-white/5 text-slate-400">
                {isMe ? 'You' : 'Opponent'}
              </span>
            </div>

            {/* name */}
            <h3 className="truncate text-sm font-semibold text-white">
              {player.name}
            </h3>

            {/* rating */}
            <p className={`text-[11px] ${styles.accent}`}>
              Rating {player.rating}
            </p>
          </div>
        </div>

        {/* STATS ROW (compact HUD style) */}
        <div className="grid grid-cols-2 gap-2">

          {/* SCORE */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="text-[9px] uppercase tracking-widest text-slate-400">
              Score
            </p>
            <p className="mt-0.5 text-base font-bold text-white">
              {player.score}
            </p>
          </div>

          {/* CLOCK */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-2">
            <p className="text-[9px] uppercase tracking-widest text-slate-400">
              Clock
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <RiTimerLine className="text-primary text-sm" />

              <span className="text-base font-bold text-white">
                {timeLeft}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Card>
  )
}