import Array2D from './Array2D'
import { ChessPiece, CreateChessPiece } from './ChessPiece'
export interface ChessBoard {
  outOfBounds(cursor): boolean
  emptyAt(cursor): boolean
  friendAt(cursor): boolean
  enemyAt(cursor): boolean
  isWhite(cursor): boolean
}

export class Board extends Array2D<ChessPiece> implements ChessBoard {
  whiteToMove = true

  constructor() {
    super(8, 8)
  }

  /*
    Set up a standard chess board
  */
  setUpDefaultBoard() {
    this.grid[0] = [
      CreateChessPiece('R', false),
      CreateChessPiece('N', false),
      CreateChessPiece('B', false),
      CreateChessPiece('Q', false),

      CreateChessPiece('K', false),
      CreateChessPiece('B', false),
      CreateChessPiece('N', false),
      CreateChessPiece('R', false),
    ]
    this.grid[1] = [
      CreateChessPiece('PB', false),
      CreateChessPiece('PB', false),
      CreateChessPiece('PB', false),
      CreateChessPiece('PB', false),

      CreateChessPiece('PB', false),
      CreateChessPiece('PB', false),
      CreateChessPiece('PB', false),
      CreateChessPiece('PB', false),
    ]
    this.grid[6] = [
      CreateChessPiece('PW', true),
      CreateChessPiece('PW', true),
      CreateChessPiece('PW', true),
      CreateChessPiece('PW', true),

      CreateChessPiece('PW', true),
      CreateChessPiece('PW', true),
      CreateChessPiece('PW', true),
      CreateChessPiece('PW', true),
    ]
    this.grid[7] = [
      CreateChessPiece('R', true),
      CreateChessPiece('N', true),
      CreateChessPiece('B', true),
      CreateChessPiece('Q', true),

      CreateChessPiece('K', true),
      CreateChessPiece('B', true),
      CreateChessPiece('N', true),
      CreateChessPiece('R', true),
    ]
  }

  outOfBounds(c) {
    return c[0] < 0 || c[0] >= 8 || c[1] < 0 || c[1] >= 8
  }

  /*
    An empty space means the enemy is >>NOT<< there
  */
  enemyAt(c: Array<number>) {
    if (this.getAt(c) == null) {
      return false
    }
    if (this.whiteToMove) {
      return !this.getAt(c).isWhite() // white's move and we're white, so black is enemy
    } else {
      return this.getAt(c).isWhite()
    }
  }

  /*
    Check if there is a piece in the given spot
  */
  emptyAt(c: Array<number>) {
    return this.getAt(c) == null
  }

  /*
    Check if the piece in the given spot belongs to the side whose turn it is
  */
  friendAt(c: Array<number>) {
    if (this.getAt(c) == null) {
      return false
    }
    if (this.whiteToMove) {
      return this.getAt(c).isWhite()
    } else {
      return !this.getAt(c).isWhite()
    }
  }

  isWhite(cursor) {
    const c = this.getAt(cursor)
    return c && c.isWhite()
  }

  /*
    Check if the given move is on the given list of moves
  */
  isMoveOnList(move, list) {
    for (const validMove of list) {
      if (move[0] === validMove[0] && move[1] === validMove[1]) {
        return true
      }
    }

    return false
  }

  /*
    Perform a valid move
    Will also flip the whiteToMove boolean
  */
  performMove(src, dest) {
    if (this.friendAt(src) && this.isMoveOnList(dest, this.generateMoveList(src))) {
      this.setAt(dest, this.getAt(src))
      this.setAt(src, null)
      this.whiteToMove = !this.whiteToMove
    }
  }

  /*
    The following functions generate a list
    of possible moves for 2 different types of pieces
  */

  generateMoveList(c) {
    const p: ChessPiece = this.getAt(c)

    if (p == null) {
      return null
    }
    return p.generateMoves(c, this)
  }
}
