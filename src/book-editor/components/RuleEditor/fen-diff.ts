import { PiecesDiff, Key, Piece } from "chessground/types";

// e.g. ["rnbqkbnr", "pppppppp", "--------", "--------", "--------", "--------", "PPPPPPPP", "RNBQKBNR"]
type PieceRows = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

function piecePositionsToRows(piecePositions: string): PieceRows {
  const rows: string[] = piecePositions
    .replace(/\d/g, (number) => "-".repeat(parseInt(number)))
    .split("/");
  return rows as PieceRows;
}

function characterToPiece(character: string): Piece {
  const characterToRole: Record<string, Piece["role"]> = {
    p: "pawn",
    b: "bishop",
    n: "knight",
    r: "rook",
    q: "queen",
    k: "king",
  };
  return {
    role: characterToRole[character.toLowerCase()],
    color: character.toLowerCase() === character ? "black" : "white",
  };
}

export function createPiecesDiff(
  oldPiecePositions: string,
  newPiecePositions: string
): PiecesDiff {
  const diff: PiecesDiff = new Map();
  const oldRows = piecePositionsToRows(oldPiecePositions);
  const newRows = piecePositionsToRows(newPiecePositions);
  for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
      const rank = (8 - rankIndex).toString();
      const file = "abcdefgh".charAt(fileIndex);
      const oldPiece = oldRows[rankIndex][fileIndex];
      const newPiece = newRows[rankIndex][fileIndex];
      if (oldPiece !== newPiece) {
        diff.set(
          `${file}${rank}` as Key,
          newPiece === "-" ? undefined : characterToPiece(newPiece)
        );
      }
    }
  }
  return diff;
}
