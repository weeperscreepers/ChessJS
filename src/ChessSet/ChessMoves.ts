import { ChessBoard } from './ChessBoard'
import { addArrays } from './util'

/*
    A given piece is defined by how it moves,
    here we give move generating functions that can
    be applied to different pieces.
*/

/*
    Very generic function that will be specialized for different
    kinds of move generators
*/
const moveGenerator = (
  mapfn: (cursor: number[], board: ChessBoard) => (n: number[]) => number[][],
  filterfn: (cursor: number[], board: ChessBoard) => (n: number[]) => boolean
) => (deltas: number[][]) => (cursor: number[], board: ChessBoard) =>
  deltas.map(mapfn(cursor, board)).reduce((ls, cur) => ls.concat(cur), []).filter(filterfn(cursor, board))

// some pieces require a clear path to the desination
export const clearPathMoves = moveGenerator(
  (cursor: number[], board: ChessBoard) => (delta: number[]) => {
    const moves = []
    let dest = addArrays(cursor, delta)
    while (!board.outOfBounds(dest) && board.emptyAt(dest)) {
      moves.push(dest)
      dest = addArrays(dest, delta)
    }
    if (!board.outOfBounds(dest) && board.enemyAt(dest)) moves.push(dest)
    return moves
  },
  (cursor: number[], board: ChessBoard) => (dest: number[]) =>
    !board.outOfBounds(dest) && (board.emptyAt(dest) || board.enemyAt(dest))
)

// Others just need have the right destination
export const simpleMoves = moveGenerator(
  (cursor: number[], board: ChessBoard) => (delta: number[]) => [addArrays(cursor, delta)],
  (cursor: number[], board: ChessBoard) => (dest: number[]) =>
    !board.outOfBounds(dest) && (board.emptyAt(dest) || board.enemyAt(dest))
)

// Some pieces (pawns) are not allowed to capture
export const simpleMovesNoCapture = moveGenerator(
  (cursor: number[], board: ChessBoard) => (delta: number[]) => [addArrays(cursor, delta)],
  (cursor: number[], board: ChessBoard) => (dest: number[]) => !board.outOfBounds(dest) && board.emptyAt(dest)
)

// Pawns have special moves if they are the right color in the right place
export const pawnExtraMoves = moveGenerator(
  (cursor: number[], board: ChessBoard) => (delta: number[]) => {
    const moves = []
    if (board.isWhite(cursor) && cursor[0] === 6) {
      moves.push(addArrays(cursor, delta))
    } else if (!board.isWhite(cursor) && cursor[0] === 1) {
      moves.push(addArrays(cursor, delta))
    }
    return moves
  },
  (cursor: number[], board: ChessBoard) => (dest: number[]) => !board.outOfBounds(dest) && board.emptyAt(dest)
)

/*
    Pawns can only diagonal attack if there is an enemy there
  */
export const pawnDiagonalAttackMoves = moveGenerator(
  (cursor: number[], board: ChessBoard) => (delta: number[]) => [addArrays(cursor, delta)],
  (cursor: number[], board: ChessBoard) => (dest: number[]) => !board.outOfBounds(dest) && board.enemyAt(dest)
)

// TODO: en passant
