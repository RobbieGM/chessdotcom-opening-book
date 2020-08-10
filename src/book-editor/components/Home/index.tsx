import { FunctionComponent, h } from "preact";
import Edit from "react-feather/dist/icons/edit";
import PlusCircle from "react-feather/dist/icons/plus-circle";
import Trash from "react-feather/dist/icons/trash";
import { updateBook, useOpeningBookNames } from "../../services/books";

interface Props {
  editBook: (bookName: string) => void;
}

const Home: FunctionComponent<Props> = ({ editBook }) => {
  const openingBookNames = useOpeningBookNames();
  function createBook() {
    const bookName = prompt("Enter book name (must be unique)");
    if (bookName == null) return;
    updateBook(bookName, {});
  }
  return (
    <div>
      <h1 class="text-4xl font-bold mt-12 mb-6 text-center">
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
    </div>
  );
};

export default Home;
