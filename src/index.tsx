import { Router } from "solid-app-router";
import { render } from "solid-js/web";
import App from "./App";
import GamesDataProvider from "./GameDataProvider";
import "./index.css";

render(
  () => (
    <Router>
      <GamesDataProvider>
        <App />
      </GamesDataProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
