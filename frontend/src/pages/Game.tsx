import { useMemo, useState } from 'react'
import {
  algebraic,
  createGame,
  getLegalMoves,
  makeMove,
  sameSquare,
  type Piece,
  type GameState,
  type Square,
} from '@/lib/chessEngine'
import { PlayerInfo } from '@/components/game/PlayerInfo'
import { players } from '@/constants/players'
import { boardThemes } from '@/constants/themes'

export const Game = () => {
  const [game, setGame] = useState<GameState>(() => createGame())
  const [selected, setSelected] = useState<Square | null>(null)

  const legalMoves = useMemo(() => getLegalMoves(game, selected ?? undefined), [game, selected])
  const allLegalMoves = useMemo(() => getLegalMoves(game), [game])
  const theme = boardThemes.night

  function onSquareClick(square: Square) {
    const piece = game.board[square.row][square.col]
    const selectedMove = legalMoves.find((move) => sameSquare(move.to, square))

    if (selectedMove) {
      const next = makeMove(game, selectedMove)
      setGame(next)
      setSelected(null)
      return
    }

    if (piece?.color === game.turn) {
      setSelected(square)
      return
    }

    setSelected(null)
  }

  function pieceMaskStyle(piece: Piece) {
    return {
      backgroundColor: piece.color === 'w' ? theme.whitePieceColor : theme.blackPieceColor,
      WebkitMaskImage: `url(${pieceImage(piece)})`,
      maskImage: `url(${pieceImage(piece)})`,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      width: '82%',
      height: '82%',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), 0 16px 28px rgba(0,0,0,0.22)',
    } as const
  }

  return (
    <main className=" overflow-x-hidden grid grid-cols-1 md:gap-6 gap-4 md:p-4  text-white lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_minmax(0,320px)]">
      <div className="flex min-h-0 flex-col gap-5 overflow-hidden lg:col-auto">
        <PlayerInfo player={players[0]} timeLeft="00:12:34" isMe={true} role="primary" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-visible lg:col-span-1">
        <div className="mx-auto w-full max-w-[min(100vw-2rem,calc(100vh-22rem),42rem)]">
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/95 p-3 shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
            <div className="grid aspect-square w-full max-h-[min(100vw-2rem,calc(100vh-24rem),42rem)] grid-cols-8 overflow-hidden rounded-3xl border border-white/10" style={{ backgroundColor: theme.lightSquareColor }}>
            {game.board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const square = { row: rowIndex, col: colIndex }
                const isLight = (rowIndex + colIndex) % 2 === 0
                const isSelected = sameSquare(selected, square)
                const move = legalMoves.find((candidate) => sameSquare(candidate.to, square))
                const canStartMove =
                  piece?.color === game.turn &&
                  allLegalMoves.some((candidate) => sameSquare(candidate.from, square))
                const squareColor = isSelected
                  ? isLight
                    ? '#efde7d'
                    : '#b16919'
                  : isLight
                  ? theme.lightSquareColor
                  : theme.darkSquareColor

                return (
                  <button
                    key={algebraic(square)}
                    type="button"
                    onClick={() => onSquareClick(square)}
                    className={['relative flex aspect-square items-center justify-center leading-none transition', canStartMove ? 'cursor-pointer' : 'cursor-default', isSelected ? 'shadow-[inset_0_0_0_4px_rgba(249,203,0,0.5)]' : ''].join(' ')}
                    style={{ backgroundColor: squareColor }}
                    aria-label={algebraic(square)}
                  >
                    {piece && (
                      <div
                        className="pointer-events-none relative z-10 rounded-[25%]"
                        style={pieceMaskStyle(piece)}
                      />
                    )}
                    {move && (
                      <span
                        className={['absolute rounded-full', move.captured ? 'inset-2 border-4 border-[#f7c948]/80' : 'h-4 w-4 rounded-full bg-[#f7c948]/80 sm:h-5 sm:w-5'].join(' ')}
                      />
                    )}
                    {isSelected && <span className="absolute inset-0 rounded-[10%] bg-primary/15" />}
                    <span className="absolute bottom-1 right-1 text-[10px] font-semibold text-slate-800/60">
                      {rowIndex === 7 ? algebraic(square)[0] : ''}
                      {colIndex === 0 ? algebraic(square)[1] : ''}
                    </span>
                  </button>
                )
              }),
            )}
          </div>
        </div>
      </div>
    </div>

      <div className="flex min-h-0 flex-col gap-5 overflow-hidden lg:col-auto">
        <PlayerInfo player={players[1]} timeLeft="00:12:34" isMe={false} role="secondary" />
      </div>
    </main>
  )
}

function pieceImage(piece: Piece): string {
  return `/pieces/${piece.color}${piece.type}.svg`
}
