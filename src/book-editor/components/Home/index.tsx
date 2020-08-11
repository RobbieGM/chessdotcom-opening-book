import { FunctionComponent, h } from "preact";
import BookListManager from "../BookListManager";

interface Props {
  editBook: (bookName: string) => void;
}

const Home: FunctionComponent<Props> = ({ editBook }) => {
  return (
    <div>
      <h1 class="text-4xl font-bold pt-12 mb-6 text-center">
        Chess.com Opening Book Editor
      </h1>
      <BookListManager editBook={editBook} />
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
