import {
  clearPathMoves,
  pawnDiagonalAttackMoves,
  pawnExtraMoves,
  simpleMoves,
  simpleMovesNoCapture,
} from './ChessMoves'

import { ChessBoard } from './ChessBoard'

import deltas from './PieceDeltas'

export interface ChessPiece {
  isWhite(): boolean

  generateMoves(cursor: number[], board: ChessBoard): number[][]
}

/**
  Here we construct the regular chess pieces and define
  their move generating functions from more primitive
  move generating functions defined in ChessMoves, configured
  with constants from PieceDeltas
 */
export class BasePiece implements ChessPiece {
  white = true

  constructor(w) {
    this.white = w
  }

  generateMoves(cursor: number[], board: ChessBoard) {
    return []
  }

  isWhite() {
    return this.white
  }
}

export class Rook extends BasePiece implements ChessPiece {
  generateMoves = (a, b) => {
    return clearPathMoves(deltas.R)(a, b)
  }
}
export class Queen extends BasePiece implements ChessPiece {
  generateMoves = clearPathMoves(deltas.Q)
}
export class Bishop extends BasePiece implements ChessPiece {
  generateMoves = clearPathMoves(deltas.B)
}

export class King extends BasePiece implements ChessPiece {
  generateMoves = simpleMoves(deltas.K)
}
export class Knight extends BasePiece implements ChessPiece {
  generateMoves = simpleMoves(deltas.N)
}

export class Pawn extends BasePiece implements ChessPiece {
  generateMoves = (cursor: number[], board: ChessBoard) => {
    const simple = simpleMovesNoCapture(this.isWhite() ? deltas.PW : deltas.PB)
    const diag = pawnDiagonalAttackMoves(this.isWhite() ? deltas.PW_diag : deltas.PB_diag)
    const firstMove = pawnExtraMoves(this.isWhite() ? deltas.PW_first : deltas.PB_first)
    return [...simple(cursor, board), ...diag(cursor, board), ...firstMove(cursor, board)]
  }
}

export const CreateChessPiece = (type: string, isWhite: boolean) => {
  const typeMap = {
    R: Rook,
    B: Bishop,
    K: King,
    Q: Queen,
    N: Knight,
    PW: Pawn,
    PB: Pawn,
  }
  const piece = new typeMap[type](isWhite)
  // piece.deltas = deltas[type];
  return piece
}
