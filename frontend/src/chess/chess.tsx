"use client";
import React from "react";
import "./chess.css";
import ChessBoard from "../board/board";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Chess = () => {
  function makeLocalStorageEmpty() {
    const email = window.localStorage.getItem("useremail");

    localStorage.clear();
    if (email !== undefined && email !== null) {
      localStorage.setItem("useremail", email);
    }
    window.location.reload();
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <button className="button" onClick={makeLocalStorageEmpty}>
            new game
          </button>
          <ChessBoard />
        </div>
      </DndProvider>
    </>
  );
};

export default Chess;
