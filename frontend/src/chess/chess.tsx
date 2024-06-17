"use client";
import React from "react";
import "./chess.css";
import ChessBoard from "../board/board";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Image from "next/image";

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
          <a href="/" className="">
            <Image
              width={150}
              height={40}
              className="button left-2"
              src="/logo.png"
              alt="logo"
            />
          </a>
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
