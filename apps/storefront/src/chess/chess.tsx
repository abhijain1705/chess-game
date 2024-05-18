"use client";
import React from "react";
import css from "./chess.module.css";
import ChessBoard from "../board/board";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Chess = () => {
  function makeLocalStorageEmpty() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className={css.App}>
          <button className={css.button} onClick={makeLocalStorageEmpty}>
            new game
          </button>
          <ChessBoard />
        </div>
      </DndProvider>
    </>
  );
};

export default Chess;
