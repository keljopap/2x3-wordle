import { Route, Routes } from "solid-app-router";
import { Component, createMemo, useContext } from "solid-js";
import Game from "./Game";
import { GamesDataContext } from "./GameDataProvider";
import Header from "./Header";

const App: Component = () => {
  const context = createMemo(() => useContext(GamesDataContext));
  return context() ? (
    <div class="w-full h-full absolute flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<Game mode="daily" />} />
        <Route path="/practice" element={<Game mode="free" />} />
      </Routes>
    </div>
  ) : null;
};

export default App;
