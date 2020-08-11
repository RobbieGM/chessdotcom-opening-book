import { FunctionComponent, h } from "preact";
import Download from "react-feather/dist/icons/download";
import Edit from "react-feather/dist/icons/edit";
import PlusCircle from "react-feather/dist/icons/plus-circle";
import Trash from "react-feather/dist/icons/trash";
import { updateBook, useOpeningBookNames, getBook } from "../../services/books";

interface Props {
  editBook: (bookName: string) => void;
}

function saveData(data: any, fileName: string) {
  const a = document.getElementById("download") as HTMLAnchorElement;
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "octet/stream" });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

const Home: FunctionComponent<Props> = ({ editBook }) => {
  const openingBookNames = useOpeningBookNames();
  function createBook() {
    const bookName = prompt("Enter book name (must be unique)");
    if (bookName == null) return;
    updateBook(bookName, {});
  }
  function exportBook(name: string) {
    const invalidCharacters = /[/<>:"\\|?*]/g;
    saveData(getBook(name), `${name.replace(invalidCharacters, "_")}.json`);
  }
  return (
    <div>
      <h1 class="text-4xl font-bold pt-12 mb-6 text-center">
        Chess.com Opening Book Editor
      </h1>
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

        <footer class="mt-2">
          <button onClick={createBook}>
            <PlusCircle size={18} />
            Create book
          </button>
        </footer>
      </div>
      <h2 class="text-3xl font-bold my-4 text-center">
        What Is This and How Do I Use It?
      </h2>
      <p class="mx-auto max-w-2xl">
        This is a tool that creates opening books to be loaded into the{" "}
        <a
          href="https://github.com/RobbieGM/chessdotcom-opening-book"
          rel="noopener noreferrer"
        >
          Chess.com Opening Book
        </a>{" "}
        userscript for{" "}
        <a href="https://www.tampermonkey.net/" rel="noopener noreferrer">
          TamperMonkey
        </a>
        . The userscript automatically plays opening moves of your choice when
        provided with an opening book, which can be created and configured
        through this tool. Start by creating a book above, then export it and
        drag-and-drop the generated JSON file into chess.com/live to load the
        opening book into the userscript (the script must be installed and
        running while drag-and-dropping.) The userscript can be downloaded from
        this project&rsquo;s{" "}
        <a href="https://github.com/RobbieGM/chessdotcom-opening-book/releases">
          GitHub releases page
        </a>
        .
      </p>
    </div>
  );
};

export default Home;
