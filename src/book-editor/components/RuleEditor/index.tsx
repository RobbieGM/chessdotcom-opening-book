import { Chessground } from "chessground";
import { Api as ChessgroundObject } from "chessground/api";
import { Key } from "chessground/types";
import { FunctionComponent, h, Component, createRef } from "preact";
import { useRef, useState, useCallback } from "preact/hooks";
import { useEffect } from "react";
import { createPiecesDiff } from "./fen-diff";

interface Props {
  partialFEN: string;
  /**
   * Function to set partial FEN. If absent, only move can be set and position is uneditable.
   */
  editable:
  | {
    enabled: false;
  }
  | {
    enabled: true;
    onEdit: (partialFEN: string, move: { from: Key; to: Key }) => void;
  };
  move: string | null;
  setMove: (move: string) => void;
  /**
   * If true, will cause setPartialFEN calls to update the side to move to the opposite side of the last moved piece.
   */
  updateSideToMoveByLastMovedPiece?: boolean;
}

export default class RuleEditor extends Component<Props> {
  chessground = createRef<ChessgroundObject>();
  private drawArrow(): void {
    if (this.chessground.current == null) {
      return;
    }
    if (this.props.move == null) {
      this.chessground.current.setShapes([]);
      return;
    }
    const isExtendedNotation = !isNaN(parseInt(this.props.move[1], 10)) && this.props.move.length >= 4;
    this.chessground.current.setShapes(
      isExtendedNotation ? [
        {
          brush: "blue",
          orig: this.props.move.slice(0, 2) as Key,
          dest: this.props.move.slice(2, 4) as Key,
        },
      ] : []
    );
  }
  componentDidUpdate(): void {
    this.drawArrow();
    const [piecePositioning] = this.props.partialFEN.split(" ");
    if (this.chessground.current) {
      if (piecePositioning !== this.chessground.current.getFen()) {
        const diff = createPiecesDiff(
          this.chessground.current.getFen(),
          piecePositioning
        );
        this.chessground.current.setPieces(diff);
      }
    }
  }
  componentWillUnmount(): void {
    this.chessground.current?.destroy();
  }
  render({ partialFEN, updateSideToMoveByLastMovedPiece }: Props): JSX.Element {
    return (
      <div className="merida blue">
        <div
          ref={(div) => {
            if (div) {
              if (this.chessground.current == null) {
                const chessground = Chessground(div, {
                  fen: partialFEN.split(" ")[0],
                  highlight: { lastMove: false },
                  coordinates: false,
                  draggable: { enabled: this.props.editable.enabled },
                  movable: { free: this.props.editable.enabled, color: "both" },
                  events: {
                    move: (orig, dest) => {
                      if (this.props.editable.enabled) {
                        const piecePositioning = chessground.getFen();
                        const previousSideToMove = partialFEN.split(" ")[1];
                        const sideToMove:
                          | "w"
                          | "b" = updateSideToMoveByLastMovedPiece
                            ? chessground.state.pieces.get(dest)?.color ===
                              "white"
                              ? "b"
                              : "w"
                            : (previousSideToMove as "w" | "b");
                        const newPartialFEN = `${piecePositioning} ${sideToMove}`;
                        this.props.editable.onEdit(newPartialFEN, {
                          from: orig,
                          to: dest,
                        });
                      }
                    },
                  },
                  drawable: {
                    eraseOnClick: false,
                    onChange: (shapes) => {
                      const arrowJustDrawn = shapes.find(
                        (shape) => shape.dest && shape.brush === "green"
                      );
                      if (arrowJustDrawn) {
                        this.props.setMove(
                          `${arrowJustDrawn.orig}${arrowJustDrawn.dest}`
                        );
                      } else {
                        this.drawArrow();
                      }
                    },
                  },
                });
                this.chessground.current = chessground;
                this.drawArrow();
              }
            }
          }}
        ></div>
      </div>
    );
  }
}
