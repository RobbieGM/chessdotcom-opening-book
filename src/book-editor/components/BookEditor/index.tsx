import cn from "classnames";
import { Fragment, FunctionComponent, h } from "preact";
import { useState } from "preact/hooks";
import ArrowLeft from "react-feather/dist/icons/arrow-left";
import Book from "react-feather/dist/icons/book";
import OmniEditor from "../OmniEditor";
import RulesEditorGrid from "../RulesEditorGrid";

interface Props {
  bookName: string;
  goBack: () => void;
}

const button = "px-2 rounded";

const BookEditor: FunctionComponent<Props> = ({ bookName, goBack }) => {
  const [viewMode, setViewMode] = useState<"omni-editor" | "rules-overview">(
    "rules-overview"
  );
  return (
    <Fragment>
      <nav class="p-4 border-b flex items-center">
        <button onClick={goBack}>
          <ArrowLeft />
        </button>
        <span className="flex-1 inline-flex justify-center items-center">
          <Book size={18} />
          {bookName}
        </span>
        <div class="space-x-2">
          <button
            class={cn(button, viewMode === "rules-overview" && "bg-gray-300")}
            onClick={() => setViewMode("rules-overview")}
          >
            Rules overview
          </button>
          <button
            class={cn(button, viewMode === "omni-editor" && "bg-gray-300")}
            onClick={() => setViewMode("omni-editor")}
          >
            Omni-editor
          </button>
        </div>
      </nav>
      {viewMode == "omni-editor" ? (
        <OmniEditor bookName={bookName} />
      ) : viewMode === "rules-overview" ? (
        <RulesEditorGrid bookName={bookName} />
      ) : null}
    </Fragment>
  );
};

export default BookEditor;
