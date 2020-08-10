import "preact/debug";
import { render, h } from "preact";
import App from "./components/App/index";
import "./chessground.global.css";
import "./main.global.css";

const mainElement = document.getElementById("main");
if (mainElement) {
  render(<App />, mainElement);
}
