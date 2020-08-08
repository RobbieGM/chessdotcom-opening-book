import { render, h } from "preact";
import App from "./components/App/index";

const mainElement = document.getElementById("main");
if (mainElement) {
  render(<App />, mainElement);
}
