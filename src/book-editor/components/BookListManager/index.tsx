import { FunctionComponent, h } from "preact";
import { useRef, useState } from "preact/hooks";
import Download from "react-feather/dist/icons/download";
import X from "react-feather/dist/icons/x";
import Edit from "react-feather/dist/icons/edit";
import GitMerge from "react-feather/dist/icons/git-merge";
import PlusCircle from "react-feather/dist/icons/plus-circle";
import Trash from "react-feather/dist/icons/trash";
import Upload from "react-feather/dist/icons/upload";
import { getBook, updateBook, useOpeningBookNames } from "../../services/books";
import OpeningBook from "../../types/opening-book";
import { readAsText, saveData as saveJSONFile } from "./file-utils";

interface Props {
  editBook: (bookName: string) => void;
}

const BookListManager: FunctionComponent<Props> = ({ editBook }) => {
  const openingBookNames = useOpeningBookNames();
  const bookFileInputRef = useRef<HTMLInputElement>();
  const [bookSelectedForMerge, setBookSelectedForMerge] = useState<
    string | null
  >(null);
  function createBook() {
    const bookName = prompt("Enter book name (must be unique)");
    if (bookName == null) return;
    updateBook(bookName, {});
  }
  function exportBook(name: string) {
    const invalidCharacters = /[/<>:"\\|?*]/g;
    const book = getBook(name);
    if (book) {
      saveJSONFile(book, `${name.replace(invalidCharacters, "_")}.json`);
    }
  }
  async function importBook(file: File) {
    const nameWithoutExtension = file.name.slice(0, file.name.lastIndexOf("."));
    const content = JSON.parse(await readAsText(file)) as OpeningBook;
    if (
      !openingBookNames.includes(nameWithoutExtension) ||
      confirm(
        `Overwrite saved version of "${nameWithoutExtension}" with imported version?`
      )
    ) {
      updateBook(nameWithoutExtension, content);
    }
  }
  function mergeWithSelected(name: string) {
    const primary = name;
    const secondary = bookSelectedForMerge;
    if (secondary == null) {
      alert("Must select a book for merge before merging.");
      return;
    }
    const primaryContent = getBook(primary);
    const secondaryContent = getBook(secondary);
    if (primaryContent == null || secondaryContent == null) {
      alert("A selected opening book does not exist anymore.");
      return;
    }
    if (
      !confirm(
        `Merge "${secondary}" into "${primary}"? If rules conflict, rules from "${primary}" will take ` +
        `priority. This operation will overwrite the book "${primary}" and cannot be undone.`
      )
    ) {
      return;
    }
    const mergedContent = { ...secondaryContent, ...primaryContent };
    updateBook(primary, mergedContent);
    setBookSelectedForMerge(null);
  }
  return (
    <div class="border max-w-3xl mx-auto p-4 rounded">
      <header>
        <h2 class="font-bold text-lg mb-2">My Opening Books</h2>
      </header>
      <section>
        {openingBookNames.length > 0 ? (
          openingBookNames.map((name) => (
            <div
              key={name}
              class="flex justify-between border-t first:border-none"
            >
              <span>{name}</span>
              <div class="space-x-2">
                {bookSelectedForMerge == null ? (
                  <button onClick={() => setBookSelectedForMerge(name)}>
                    <GitMerge size={18} />
                    Merge into...
                  </button>
                ) : bookSelectedForMerge === name ? (
                  <button onClick={() => setBookSelectedForMerge(null)}>
                    <X size={18} />
                    Cancel merge
                  </button>
                ) : (
                  <button onClick={() => mergeWithSelected(name)}>
                    <GitMerge size={18} />
                    Merge with selected
                  </button>
                )}
                <button onClick={() => exportBook(name)}>
                  <Download size={18} />
                  Export
                </button>
                <button onClick={() => editBook(name)}>
                  <Edit size={18} />
                  Edit
                </button>
                <button onClick={() => updateBook(name, undefined)}>
                  <Trash size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>You don&rsquo;t have any opening books saved.</p>
        )}
      </section>

      <footer class="mt-2 space-x-2">
        <button onClick={createBook}>
          <PlusCircle size={18} />
          Create book
        </button>
        <button onClick={() => bookFileInputRef.current.click()}>
          <Upload size={18} />
          <input
            type="file"
            ref={bookFileInputRef}
            accept="application/json"
            style="display: none"
            onChange={() =>
              bookFileInputRef.current.files &&
              importBook(bookFileInputRef.current.files[0])
            }
          />
          Import book
        </button>
      </footer>
    </div>
  );
};

export default BookListManager;
