export type BoardThemeKey = 'classic' | 'night' | 'pastel'

export type BoardTheme = {
  blackPieceColor: string
  whitePieceColor: string
  lightSquareColor: string
  darkSquareColor: string
}

export const boardThemes: Record<BoardThemeKey, BoardTheme> = {
  classic: {
    blackPieceColor: '#222222',
    whitePieceColor: '#f9f7ed',
    lightSquareColor: '#f3e8d0',
    darkSquareColor: '#7b5d43',
  },
  night: {
    blackPieceColor: '#d9d9ff',
    whitePieceColor: '#ffeb99',
    lightSquareColor: '#1f2937',
    darkSquareColor: '#111827',
  },
  pastel: {
    blackPieceColor: '#2f4f4f',
    whitePieceColor: '#f8f1d6',
    lightSquareColor: '#f7f1e3',
    darkSquareColor: '#b39c82',
  },
}
