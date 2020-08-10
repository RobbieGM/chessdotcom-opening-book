import { FunctionComponent, Fragment, h } from "preact";
import RuleEditor from "../RuleEditor";
import { useState } from "preact/hooks";
import { useOpeningBook } from "../../services/books";
import X from "react-feather/dist/icons/x";
import RefreshCcw from "react-feather/dist/icons/refresh-ccw";

interface Props {
  bookName: string;
}

const STARTING_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";
type SavePlayedMovesAsRules = "no" | "when-white" | "when-black" | "yes";
function shouldSavePlayedMovesAsRulesForColor(
  mode: SavePlayedMovesAsRules,
  color: "w" | "b"
) {
  return (
    mode === "yes" ||
    (mode === "when-black" && color === "b") ||
    (mode === "when-white" && color === "w")
  );
}

const OmniEditor: FunctionComponent<Props> = ({ bookName }) => {
  const [partialFEN, setPartialFEN] = useState(STARTING_POSITION);
  const [piecePositioning, sideToMove] = partialFEN.split(" ");
  const setSideToMove = (side: "w" | "b") => {
    setPartialFEN(`${partialFEN.split(" ")[0]} ${side}`);
  };
  const [book, updateBook] = useOpeningBook(bookName);
  const [savePlayedMovesAsRules, setSavePlayedMovesAsRules] = useState<
    SavePlayedMovesAsRules
  >("no");
  if (book == null) {
    return <div>This opening book has been deleted.</div>;
  }
  const move: string | undefined = book[partialFEN];
  const setMove = (newMove: string) =>
    updateBook({ ...book, [partialFEN]: newMove });
  const clearMove = () => {
    if (move == null) {
      alert("This position already does not have a move defined for it.");
      return;
    }
    const { [partialFEN]: x, ...bookWithoutClearedMove } = book;
    updateBook(bookWithoutClearedMove);
  };
  const resetPosition = () => setPartialFEN(STARTING_POSITION);
  return (
    <div className="chessboard-24rem mt-2 flex mx-auto w-max-content">
      <RuleEditor
        partialFEN={partialFEN}
        editable={{
          enabled: true,
          onEdit: (newPartialFEN, { from, to }) => {
            if (
              shouldSavePlayedMovesAsRulesForColor(
                savePlayedMovesAsRules,
                sideToMove as "w" | "b"
              )
            ) {
              // update with old partial fen, not new one
              updateBook({ ...book, [partialFEN]: `${from}${to}` });
            }
            setPartialFEN(newPartialFEN);
          },
        }}
        move={move}
        setMove={setMove}
        updateSideToMoveByLastMovedPiece
      />
      <div className="w-48 ml-2">
        <div className="font-bold">Side to move</div>
        <div class="space-x-2">
          <span>
            <input
              type="radio"
              name="side-to-move"
              id="side-to-move-white"
              checked={sideToMove === "w"}
              onChange={() => setSideToMove("w")}
            />
            <label htmlFor="side-to-move-white">White</label>
          </span>
          <span>
            <input
              type="radio"
              name="side-to-move"
              id="side-to-move-black"
              checked={sideToMove === "b"}
              onChange={() => setSideToMove("b")}
            />
            <label htmlFor="side-to-move-black">Black</label>
          </span>
        </div>
        <div className="font-bold">Save played moves as rules</div>
        {([
          ["no", "No"],
          ["when-white", "When white moves"],
          ["when-black", "When black moves"],
          ["yes", "Yes"],
        ] as const).map(([value, label]) => (
          <div key={value}>
            <input
              type="radio"
              name="save-played-moves-as-rules"
              id={`save-played-moves-as-rules-${value}`}
              checked={savePlayedMovesAsRules === value}
              onChange={() => setSavePlayedMovesAsRules(value)}
            />
            <label htmlFor={`save-played-moves-as-rules-${value}`}>
              {label}
            </label>
          </div>
        ))}

        <button class="flex border rounded px-2 my-1" onClick={clearMove}>
          <X size={18} />
          Clear move
        </button>
        <button
          className="flex border rounded px-2 my-1"
          onClick={resetPosition}
        >
          <RefreshCcw size={18} />
          Reset position
        </button>
        <div class="font-mono text-xs">
          {partialFEN} -&gt; {move}
        </div>
      </div>
    </div>
  );
};

export default OmniEditor;
