export type Color = 'w' | 'b'
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type CastleSide = 'k' | 'q'

export type Piece = {
  type: PieceType
  color: Color
}

export type Square = {
  row: number
  col: number
}

export type Move = {
  from: Square
  to: Square
  piece: Piece
  captured?: Piece
  promotion?: PieceType
  isCastle?: CastleSide
  isEnPassant?: boolean
  notation: string
}

export type GameState = {
  board: (Piece | null)[][]
  turn: Color
  castling: Record<Color, Record<CastleSide, boolean>>
  enPassant: Square | null
  halfmove: number
  fullmove: number
  history: Move[]
  positionHistory: string[]
}

export const STARTING_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const pieceOrder: PieceType[] = ['p', 'n', 'b', 'r', 'q', 'k']

export function createGame(fen = STARTING_FEN): GameState {
  const state = parseFen(fen)
  state.positionHistory = [positionKey(state)]
  return state
}

export function parseFen(fen: string): GameState {
  const parts = fen.trim().split(/\s+/)

  if (parts.length < 4) {
    throw new Error('FEN needs at least board, turn, castling, and en-passant fields.')
  }

  const [placement, turn, castlingText, enPassantText, halfmoveText = '0', fullmoveText = '1'] =
    parts

  if (turn !== 'w' && turn !== 'b') {
    throw new Error('FEN turn must be "w" or "b".')
  }

  const board = emptyBoard()
  const ranks = placement.split('/')

  if (ranks.length !== 8) {
    throw new Error('FEN board placement must have 8 ranks.')
  }

  ranks.forEach((rankText, row) => {
    let col = 0

    for (const char of rankText) {
      if (/\d/.test(char)) {
        col += Number(char)
        continue
      }

      const lower = char.toLowerCase() as PieceType
      if (!pieceOrder.includes(lower)) {
        throw new Error(`Invalid FEN piece "${char}".`)
      }

      if (col > 7) {
        throw new Error('FEN rank has too many squares.')
      }

      board[row][col] = {
        type: lower,
        color: char === char.toUpperCase() ? 'w' : 'b',
      }
      col += 1
    }

    if (col !== 8) {
      throw new Error('Each FEN rank must describe exactly 8 squares.')
    }
  })

  return {
    board,
    turn,
    castling: {
      w: { k: castlingText.includes('K'), q: castlingText.includes('Q') },
      b: { k: castlingText.includes('k'), q: castlingText.includes('q') },
    },
    enPassant: enPassantText === '-' ? null : squareFromAlgebraic(enPassantText),
    halfmove: Number(halfmoveText),
    fullmove: Number(fullmoveText),
    history: [],
    positionHistory: [],
  }
}

export function toFen(state: GameState): string {
  const placement = state.board
    .map((rank) => {
      let text = ''
      let empty = 0

      rank.forEach((piece) => {
        if (!piece) {
          empty += 1
          return
        }

        if (empty) {
          text += empty
          empty = 0
        }

        const char = piece.color === 'w' ? piece.type.toUpperCase() : piece.type
        text += char
      })

      return text + (empty || '')
    })
    .join('/')

  const castling =
    `${state.castling.w.k ? 'K' : ''}${state.castling.w.q ? 'Q' : ''}` +
    `${state.castling.b.k ? 'k' : ''}${state.castling.b.q ? 'q' : ''}`

  return [
    placement,
    state.turn,
    castling || '-',
    state.enPassant ? algebraic(state.enPassant) : '-',
    state.halfmove,
    state.fullmove,
  ].join(' ')
}

export function getLegalMoves(state: GameState, from?: Square): Move[] {
  const moves = getPseudoMoves(state).filter((move) => {
    const next = applyMove(state, move, false)
    return !isKingInCheck(next, state.turn)
  })

  return from ? moves.filter((move) => sameSquare(move.from, from)) : moves
}

export function makeMove(state: GameState, move: Move): GameState {
  const legalMove = getLegalMoves(state, move.from).find((candidate) =>
    sameSquare(candidate.to, move.to),
  )

  if (!legalMove) {
    return state
  }

  const next = applyMove(state, legalMove, true)
  next.positionHistory = [...state.positionHistory, positionKey(next)]
  return next
}

export function getStatus(state: GameState): string {
  const legalMoves = getLegalMoves(state)
  const checked = isKingInCheck(state, state.turn)

  if (!legalMoves.length) {
    return checked
      ? `${colorName(opposite(state.turn))} wins by checkmate`
      : 'Draw by stalemate'
  }

  if (state.halfmove >= 100) {
    return 'Draw by fifty-move rule'
  }

  const currentKey = positionKey(state)
  const repeats = state.positionHistory.filter((key) => key === currentKey).length
  if (repeats >= 3) {
    return 'Draw by threefold repetition'
  }

  return checked ? `${colorName(state.turn)} to move, in check` : `${colorName(state.turn)} to move`
}

export function algebraic(square: Square): string {
  return `${files[square.col]}${8 - square.row}`
}

export function squareFromAlgebraic(value: string): Square {
  if (!/^[a-h][1-8]$/.test(value)) {
    throw new Error(`Invalid square "${value}".`)
  }

  return {
    col: files.indexOf(value[0]),
    row: 8 - Number(value[1]),
  }
}

export function sameSquare(a: Square | null, b: Square | null): boolean {
  return Boolean(a && b && a.row === b.row && a.col === b.col)
}

export function colorName(color: Color): string {
  return color === 'w' ? 'White' : 'Black'
}

function emptyBoard(): (Piece | null)[][] {
  return Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null))
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    board: state.board.map((row) => row.map((piece) => (piece ? { ...piece } : null))),
    castling: {
      w: { ...state.castling.w },
      b: { ...state.castling.b },
    },
    enPassant: state.enPassant ? { ...state.enPassant } : null,
    history: [...state.history],
    positionHistory: [...state.positionHistory],
  }
}

function getPseudoMoves(state: GameState): Move[] {
  const moves: Move[] = []

  state.board.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      if (!piece || piece.color !== state.turn) {
        return
      }

      const from = { row: rowIndex, col: colIndex }

      if (piece.type === 'p') {
        addPawnMoves(state, moves, from, piece)
      } else if (piece.type === 'n') {
        addStepMoves(state, moves, from, piece, [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1],
        ])
      } else if (piece.type === 'k') {
        addStepMoves(state, moves, from, piece, [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ])
        addCastles(state, moves, from, piece)
      } else if (piece.type === 'b') {
        addSlideMoves(state, moves, from, piece, [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ])
      } else if (piece.type === 'r') {
        addSlideMoves(state, moves, from, piece, [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ])
      } else if (piece.type === 'q') {
        addSlideMoves(state, moves, from, piece, [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ])
      }
    })
  })

  return moves
}

function addPawnMoves(state: GameState, moves: Move[], from: Square, piece: Piece) {
  const direction = piece.color === 'w' ? -1 : 1
  const startRow = piece.color === 'w' ? 6 : 1
  const promotionRow = piece.color === 'w' ? 0 : 7
  const one = { row: from.row + direction, col: from.col }
  const two = { row: from.row + direction * 2, col: from.col }

  if (isInside(one) && !pieceAt(state, one)) {
    pushMove(moves, state, from, one, piece, one.row === promotionRow ? 'q' : undefined)

    if (from.row === startRow && !pieceAt(state, two)) {
      pushMove(moves, state, from, two, piece)
    }
  }

  for (const colDelta of [-1, 1]) {
    const to = { row: from.row + direction, col: from.col + colDelta }

    if (!isInside(to)) {
      continue
    }

    const target = pieceAt(state, to)
    if (target && target.color !== piece.color) {
      pushMove(moves, state, from, to, piece, to.row === promotionRow ? 'q' : undefined)
    }

    if (state.enPassant && sameSquare(to, state.enPassant)) {
      const captured = pieceAt(state, { row: from.row, col: to.col })
      if (captured?.type === 'p' && captured.color !== piece.color) {
        pushMove(moves, state, from, to, piece, undefined, true)
      }
    }
  }
}

function addStepMoves(
  state: GameState,
  moves: Move[],
  from: Square,
  piece: Piece,
  deltas: number[][],
) {
  deltas.forEach(([rowDelta, colDelta]) => {
    const to = { row: from.row + rowDelta, col: from.col + colDelta }
    const target = pieceAt(state, to)

    if (isInside(to) && target?.color !== piece.color) {
      pushMove(moves, state, from, to, piece)
    }
  })
}

function addSlideMoves(
  state: GameState,
  moves: Move[],
  from: Square,
  piece: Piece,
  directions: number[][],
) {
  directions.forEach(([rowDelta, colDelta]) => {
    let to = { row: from.row + rowDelta, col: from.col + colDelta }

    while (isInside(to)) {
      const target = pieceAt(state, to)

      if (!target) {
        pushMove(moves, state, from, to, piece)
      } else {
        if (target.color !== piece.color) {
          pushMove(moves, state, from, to, piece)
        }
        break
      }

      to = { row: to.row + rowDelta, col: to.col + colDelta }
    }
  })
}

function addCastles(state: GameState, moves: Move[], from: Square, piece: Piece) {
  const row = piece.color === 'w' ? 7 : 0
  if (from.row !== row || from.col !== 4 || isKingInCheck(state, piece.color)) {
    return
  }

  const castleOptions = [
    { side: 'k' as CastleSide, rookCol: 7, clear: [5, 6], kingPath: [5, 6] },
    { side: 'q' as CastleSide, rookCol: 0, clear: [1, 2, 3], kingPath: [3, 2] },
  ]

  castleOptions.forEach(({ side, rookCol, clear, kingPath }) => {
    const rook = state.board[row][rookCol]
    const canCastle =
      state.castling[piece.color][side] &&
      rook?.type === 'r' &&
      rook.color === piece.color &&
      clear.every((col) => !state.board[row][col]) &&
      kingPath.every((col) => !isSquareAttacked(state, { row, col }, opposite(piece.color)))

    if (canCastle) {
      pushMove(moves, state, from, { row, col: side === 'k' ? 6 : 2 }, piece, undefined, false, side)
    }
  })
}

function pushMove(
  moves: Move[],
  state: GameState,
  from: Square,
  to: Square,
  piece: Piece,
  promotion?: PieceType,
  isEnPassant = false,
  isCastle?: CastleSide,
) {
  const captured = isEnPassant ? pieceAt(state, { row: from.row, col: to.col }) : pieceAt(state, to)

  moves.push({
    from,
    to,
    piece,
    captured: captured ?? undefined,
    promotion,
    isEnPassant,
    isCastle,
    notation: `${algebraic(from)}${algebraic(to)}${promotion ?? ''}`,
  })
}

function applyMove(state: GameState, move: Move, trackHistory: boolean): GameState {
  const next = cloneState(state)
  const movingPiece = next.board[move.from.row][move.from.col]

  if (!movingPiece) {
    return next
  }

  next.board[move.from.row][move.from.col] = null

  if (move.isEnPassant) {
    next.board[move.from.row][move.to.col] = null
  }

  if (move.isCastle) {
    const row = move.from.row
    if (move.isCastle === 'k') {
      next.board[row][5] = next.board[row][7]
      next.board[row][7] = null
    } else {
      next.board[row][3] = next.board[row][0]
      next.board[row][0] = null
    }
  }

  next.board[move.to.row][move.to.col] = {
    ...movingPiece,
    type: move.promotion ?? movingPiece.type,
  }

  updateCastlingRights(next, movingPiece, move)
  next.enPassant = null

  if (movingPiece.type === 'p' && Math.abs(move.to.row - move.from.row) === 2) {
    next.enPassant = {
      row: (move.from.row + move.to.row) / 2,
      col: move.from.col,
    }
  }

  next.halfmove = movingPiece.type === 'p' || move.captured ? 0 : next.halfmove + 1
  if (state.turn === 'b') {
    next.fullmove += 1
  }
  next.turn = opposite(state.turn)

  if (trackHistory) {
    next.history = [...state.history, move]
  }

  return next
}

function updateCastlingRights(state: GameState, piece: Piece, move: Move) {
  if (piece.type === 'k') {
    state.castling[piece.color].k = false
    state.castling[piece.color].q = false
  }

  if (piece.type === 'r') {
    updateRookCastle(state, piece.color, move.from)
  }

  if (move.captured?.type === 'r') {
    updateRookCastle(state, move.captured.color, move.to)
  }
}

function updateRookCastle(state: GameState, color: Color, square: Square) {
  const homeRow = color === 'w' ? 7 : 0

  if (square.row !== homeRow) {
    return
  }

  if (square.col === 0) {
    state.castling[color].q = false
  }

  if (square.col === 7) {
    state.castling[color].k = false
  }
}

function isKingInCheck(state: GameState, color: Color): boolean {
  const king = findKing(state, color)
  return king ? isSquareAttacked(state, king, opposite(color)) : true
}

function findKing(state: GameState, color: Color): Square | null {
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = state.board[row][col]
      if (piece?.type === 'k' && piece.color === color) {
        return { row, col }
      }
    }
  }

  return null
}

function isSquareAttacked(state: GameState, square: Square, attacker: Color): boolean {
  const pawnDirection = attacker === 'w' ? -1 : 1
  for (const colDelta of [-1, 1]) {
    const pawnSquare = { row: square.row - pawnDirection, col: square.col + colDelta }
    const piece = pieceAt(state, pawnSquare)
    if (piece?.type === 'p' && piece.color === attacker) {
      return true
    }
  }

  const knightDeltas = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ]
  if (knightDeltas.some(([row, col]) => pieceAt(state, { row: square.row + row, col: square.col + col })?.type === 'n' && pieceAt(state, { row: square.row + row, col: square.col + col })?.color === attacker)) {
    return true
  }

  if (rayAttacked(state, square, attacker, ['b', 'q'], [[-1, -1], [-1, 1], [1, -1], [1, 1]])) {
    return true
  }

  if (rayAttacked(state, square, attacker, ['r', 'q'], [[-1, 0], [1, 0], [0, -1], [0, 1]])) {
    return true
  }

  for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
    for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
      if (rowDelta === 0 && colDelta === 0) {
        continue
      }

      const piece = pieceAt(state, { row: square.row + rowDelta, col: square.col + colDelta })
      if (piece?.type === 'k' && piece.color === attacker) {
        return true
      }
    }
  }

  return false
}

function rayAttacked(
  state: GameState,
  square: Square,
  attacker: Color,
  attackers: PieceType[],
  directions: number[][],
): boolean {
  return directions.some(([rowDelta, colDelta]) => {
    let target = { row: square.row + rowDelta, col: square.col + colDelta }

    while (isInside(target)) {
      const piece = pieceAt(state, target)

      if (!piece) {
        target = { row: target.row + rowDelta, col: target.col + colDelta }
        continue
      }

      return piece.color === attacker && attackers.includes(piece.type)
    }

    return false
  })
}

function pieceAt(state: GameState, square: Square): Piece | null {
  return isInside(square) ? state.board[square.row][square.col] : null
}

function isInside(square: Square): boolean {
  return square.row >= 0 && square.row < 8 && square.col >= 0 && square.col < 8
}

function opposite(color: Color): Color {
  return color === 'w' ? 'b' : 'w'
}

function positionKey(state: GameState): string {
  return toFen(state).split(' ').slice(0, 4).join(' ')
}
