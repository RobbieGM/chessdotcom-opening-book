import Chess, { ChessInstance, Square } from "chess.js";
import type { Chess as ChessType } from "chess.js";

/** Characters */
const SQUARE_CHARACTERS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?";
const DROP_CHARACTERS: Record<string, "p" | "n" | "b" | "r" | "q"> = {
  "=": "p",
  "-": "n",
  "+": "b",
  "*": "r",
  "&": "q",
};

function squareCharacterToAlgebraicSquare(squareCharacter: string) {
  const index = SQUARE_CHARACTERS.indexOf(squareCharacter);
  const file = "abcdefgh".charAt(index % 8);
  const rank = Math.floor(index / 8) + 1;
  return `${file}${rank}`;
}

function algebraicSquareToCharacter(algebraicSquare: string) {
  const [file, rank] = algebraicSquare;
  const fileIndex = "abcdefgh".indexOf(file);
  const rankIndex = parseInt(rank) - 1;
  const index = fileIndex + rankIndex * 8;
  return SQUARE_CHARACTERS[index];
}

/**
 * Converts algebraic move in the form "{from}{to}" e.g. "e2e4" to chess.com move format.
 */
export function algebraicMoveToChesscom(algebraicMove: string): string {
  const from = algebraicMove.slice(0, 2);
  const to = algebraicMove.slice(2, 4);
  return `${algebraicSquareToCharacter(from)}${algebraicSquareToCharacter(to)}`;
}

function applyMove(board: ChessInstance, move: string) {
  const [firstChar, secondChar] = move;
  const isDrop = firstChar in DROP_CHARACTERS;
  if (isDrop) {
    board.put(
      { type: DROP_CHARACTERS[firstChar], color: board.turn() },
      squareCharacterToAlgebraicSquare(secondChar) as Square
    );
    let [
      // eslint-disable-next-line prefer-const
      piecePlacement,
      sideToMove,
      // eslint-disable-next-line prefer-const
      castling,
      enPassantTarget,
      halfmoveClock,
      fullmoveNumber,
    ] = board.fen().split(" ");
    sideToMove = sideToMove === "w" ? "b" : "w";
    enPassantTarget = "-";
    halfmoveClock = (parseInt(halfmoveClock) + 1).toString();
    if (sideToMove === "w") {
      fullmoveNumber = (parseInt(fullmoveNumber) + 1).toString();
    }
    const fenWithSideToMoveSwapped = [
      piecePlacement,
      sideToMove,
      castling,
      enPassantTarget,
      halfmoveClock,
      fullmoveNumber,
    ].join(" ");
    board.load(fenWithSideToMoveSwapped);
  } else {
    const from = squareCharacterToAlgebraicSquare(firstChar);
    const to = squareCharacterToAlgebraicSquare(secondChar);
    board.move(`${from}${to}`, { sloppy: true });
  }
}

/**
 * Converts a move string in chess.com format to a FEN
 * @param moves Move string in chess.com format
 */
export function getFEN(moves: string): string {
  const board = new ((Chess as unknown) as typeof ChessType)();
  const movesArray = moves.match(/.{1,2}/g) ?? [];
  movesArray.forEach((move) => applyMove(board, move));
  return board.fen();
}
