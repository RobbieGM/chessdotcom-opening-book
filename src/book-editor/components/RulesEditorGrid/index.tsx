import { FunctionComponent, Fragment, h } from "preact";
import RuleEditor from "../RuleEditor";
import { useOpeningBook } from "../../services/books";
import Trash from "react-feather/dist/icons/trash";
import OpeningBook from "../../types/opening-book";

interface Props {
  bookName: string;
}

const RulesEditorGrid: FunctionComponent<Props> = ({ bookName }) => {
  const [book, updateBook] = useOpeningBook(bookName);
  if (book == null) {
    return <div>This book has been deleted.</div>;
  }
  const bookEntries = Object.entries(book);
  if (bookEntries.length === 0) {
    return (
      <div class="mt-2 mx-8 text-center">
        You haven&rsquo;t added any rules yet. Go to the omni-editor to add one
        by drawing arrows on the board (right-click and drag).
      </div>
    );
  }
  return (
    <div class="grid grid-cols-12rem gap-2 mt-2 mx-8 chessboard-12rem">
      {bookEntries.map(([partialFEN, move]) => (
        <div key={partialFEN}>
          <RuleEditor
            key={partialFEN}
            editable={{ enabled: false }}
            partialFEN={partialFEN}
            move={move}
            setMove={(newMove) => {
              updateBook({ ...book, ...{ [partialFEN]: newMove } });
            }}
          />
          <div className="flex text-sm justify-between">
            <span class="text-sm">
              {partialFEN.split(" ")[1] === "w"
                ? "White to move"
                : "Black to move"}
            </span>
            <button
              aria-label="Delete rule"
              title="Delete rule"
              onClick={() => {
                const { [partialFEN]: x, ...bookWithoutRule } = book;
                updateBook(bookWithoutRule);
              }}
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RulesEditorGrid;
