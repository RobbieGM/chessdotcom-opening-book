import { Chess } from "chess.js";

/**
 * Gets the resulting position after a move is made
 * @param partialFEN
 * @param move Move in long algebraic format e.g. e2e4
 * @returns partial FEN after a move is made
 */
export default function applyMove(partialFEN: string, move: string): string {
  const chess = Chess();
  chess.load(`${partialFEN} KQkq - 0 1`);
  chess.move(move, { sloppy: true });
  return chess.fen().split(" ").slice(0, 2).join(" ");
}
