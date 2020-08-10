import { FunctionComponent, h, Fragment } from "preact";
import { useState } from "preact/hooks";
import BookEditor from "../BookEditor";
import Home from "../Home";

type Page =
  | {
      name: "home";
    }
  | {
      name: "book-editor";
      bookName: string;
    };
const App: FunctionComponent = () => {
  const [currentPage, setCurrentPage] = useState<Page>({ name: "home" });
  return (
    <Fragment>
      {currentPage.name === "home" ? (
        <Home
          editBook={(bookName) =>
            setCurrentPage({ name: "book-editor", bookName })
          }
        />
      ) : currentPage.name === "book-editor" ? (
        <BookEditor
          goBack={() => setCurrentPage({ name: "home" })}
          bookName={currentPage.bookName}
        />
      ) : null}
    </Fragment>
  );
};

export default App;
