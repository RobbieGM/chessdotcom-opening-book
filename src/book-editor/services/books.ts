import { EventBus } from "light-event-bus";
import OpeningBook, { OpeningBookRecord } from "../types/opening-book";
import { useEffect, useState, StateUpdater } from "preact/hooks";

const bookEventBus = new EventBus<{
  update: {
    name: string;
    content: OpeningBook | undefined;
  };
}>();

function getBooks() {
  return JSON.parse(
    localStorage.getItem("openingBooks") ?? "{}"
  ) as OpeningBookRecord;
}

function getBook(bookName: string): OpeningBook | undefined {
  return getBooks()[bookName];
}

/**
 * Updates an opening book by name.
 * @param bookName Name of the opening book (primary key)
 * @param bookContent New book content, or undefined to delete
 */
export function updateBook(
  bookName: string,
  bookContent: OpeningBook | undefined
): void {
  const openingBooks = getBooks();
  if (bookContent) {
    openingBooks[bookName] = bookContent;
  } else {
    delete openingBooks[bookName];
  }
  localStorage.setItem("openingBooks", JSON.stringify(openingBooks));
  bookEventBus.publish("update", { name: bookName, content: bookContent });
}

export function useOpeningBookNames(): string[] {
  const [cachedBookNames, setCachedBookNames] = useState(() =>
    Object.keys(getBooks())
  );
  useEffect(() => {
    const { unsubscribe } = bookEventBus.subscribe("update", () => {
      setCachedBookNames(Object.keys(getBooks()));
    });
    return unsubscribe;
  });
  return cachedBookNames;
}

export function useOpeningBook(
  bookName: string
): [OpeningBook | undefined, StateUpdater<OpeningBook | undefined>] {
  const [cachedBook, setCachedBook] = useState<OpeningBook | undefined>(() =>
    getBook(bookName)
  );
  useEffect(() => {
    const { unsubscribe } = bookEventBus.subscribe(
      "update",
      ({ name, content }) => {
        if (name === bookName) {
          setCachedBook(content);
        }
      }
    );
    return unsubscribe;
  });
  const bookUpdater: StateUpdater<OpeningBook | undefined> = (value) => {
    const newBook = typeof value === "function" ? value(cachedBook) : value;
    updateBook(bookName, newBook);
    setCachedBook(newBook);
  };
  return [cachedBook, bookUpdater];
}
