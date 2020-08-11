export default class OpeningBook {
  dictionary: Record<string, string>;
  constructor() {
    if (localStorage.getItem("openingBook") == null) {
      console.warn("No opening book was found");
    }
    this.dictionary = {}; // TS complains about lack of definite assignment in constructor
    this.loadFromStorage();
  }
  private loadFromStorage() {
    this.dictionary = JSON.parse(localStorage.getItem("openingBook") ?? "{}");
  }
  reload(): void {
    this.loadFromStorage();
  }
  /**
   * Gets the opening move to make, or null if out of book
   * @param fen
   */
  getOpeningMove(fen: string): string | null {
    const [piecePlacement, sideToMove] = fen.split(" ");
    // Move depends on piece placement and side to move but not castling rights or en passant possibilities
    const key = `${piecePlacement} ${sideToMove}`;
    return key in this.dictionary ? this.dictionary[key] : null;
  }
}
