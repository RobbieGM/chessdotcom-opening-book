import { EventBus } from "light-event-bus";
import OpeningBook, { OpeningBookRecord } from "../types/opening-book";
import { useEffect, useState, StateUpdater } from "preact/hooks";

const bookEventBus = new EventBus<{
  update: undefined;
}>();

// cache for localStorage.openingBooks to avoid JSON parsing and stringifying more than necessary
const openingBooks: OpeningBookRecord = loadBooks();

function loadBooks(): OpeningBookRecord {
  return JSON.parse(localStorage.getItem("openingBooks") ?? "{}");
}

export function getBook(bookName: string): OpeningBook | undefined {
  return openingBooks[bookName];
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
  if (bookContent) {
    openingBooks[bookName] = bookContent;
  } else {
    delete openingBooks[bookName];
  }
  localStorage.setItem("openingBooks", JSON.stringify(openingBooks));
  bookEventBus.publish("update", undefined);
}

export function useOpeningBookNames(): string[] {
  const [cachedBookNames, setCachedBookNames] = useState(() =>
    Object.keys(openingBooks)
  );
  useEffect(() => {
    const { unsubscribe } = bookEventBus.subscribe("update", () => {
      setCachedBookNames(Object.keys(openingBooks));
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
    const { unsubscribe } = bookEventBus.subscribe("update", () => {
      if (cachedBook !== openingBooks[bookName]) {
        setCachedBook(openingBooks[bookName]);
      }
    });
    return unsubscribe;
  });
  const bookUpdater: StateUpdater<OpeningBook | undefined> = (value) => {
    const newBook = typeof value === "function" ? value(cachedBook) : value;
    updateBook(bookName, newBook);
    setCachedBook(newBook);
  };
  return [cachedBook, bookUpdater];
}
