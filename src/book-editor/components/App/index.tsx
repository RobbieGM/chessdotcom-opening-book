import { FunctionComponent, Fragment, h } from "preact";
import style from "./style.module.scss";
import cn from "classnames";

const App: FunctionComponent = () => (
  <Fragment>
    <div class={style.test}>test</div>
  </Fragment>
);

export default App;
