/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { findPathToKing, possiblePositions } from "./logics";

const Square = ({
  dark,
  index,
  id,
  highlightedBoxes,
  setplayerBEats,
  setplayerAEats,
  playerAEats,
  playerBEats,
  sethighlightedBoxes,
  currentClickedPiece,
  currentTurn,
  setcurrentTurn,
  setcurrentClickedPiece,
  setBoard,
  board,
  square,
}) => {
  const is2DArray = useCallback((array) => {
    return Array.isArray(array) && array.some(Array.isArray);
  }, []);

  const storeReactComponentInLocalStorage = useCallback(
    (array, key) => {
      // Convert board state to a serializable format
      let serializableBoard = [];
      if (is2DArray(array)) {
        serializableBoard = array.map((row) =>
          row.map((square) => (square ? square.props.id : ""))
        );
      } else {
        serializableBoard = array.map((square) =>
          square ? square.props.id : ""
        );
      }

      // Serialize the state into a JSON string
      const serializedState = JSON.stringify(serializableBoard);

      // Store the serialized state in local storage
      localStorage.setItem(key, serializedState);
    },
    [is2DArray]
  );

  function saveBoardProgress(board) {
    storeReactComponentInLocalStorage(board, "board");
  }

  function savePlayerBProgress(playerBEats) {
    storeReactComponentInLocalStorage(playerBEats, "playerBEats");
  }

  function saveCurrentTurn(currentTurn) {
    localStorage.setItem("currentTurn", currentTurn);
  }

  function savePlayerAProgress(playerAEats) {
    storeReactComponentInLocalStorage(playerAEats, "playerAEats");
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "warrior",
      item: { col: id, row: index },
      canDrag: (monitor) => {
        const element = board[index][id];
        const pieceId = element.props.id;
        if (
          (currentTurn === "black" && pieceId.includes("black")) ||
          (currentTurn === "white" && pieceId.includes("white"))
        ) {
          return true;
        } else {
          return false;
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [currentTurn]
  );

  const deepCloneArray = useCallback((arr) => {
    // Check if the input is an array
    if (!Array.isArray(arr)) {
      throw new Error("Input is not an array");
    }

    // Initialize an empty result array
    const result = [];

    // Iterate over each element in the array
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];

      // Check if the element is an array
      if (Array.isArray(element)) {
        // If the element is an array, recursively clone it
        result.push(deepCloneArray(element));
      } else if (typeof element === "object" && element !== null) {
        // If the element is an object, clone it using object spread
        result.push({ ...element });
      } else {
        // For primitive types, directly push the value
        result.push(element);
      }
    }

    // Return the cloned array
    return result;
  }, []);

  const isCheckCase = useCallback(
    (newBoard) => {
      // Get the id of the current player's king
      const currentPlayerKingId = `king-${currentTurn}`;

      // Get the id of the opponent player's king
      const opponentPlayerKingId = `king-${
        currentTurn === "white" ? "black" : "white"
      }`;

      // Iterate over each square on the board
      for (let row = 0; row < newBoard.length; row++) {
        for (let col = 0; col < newBoard[row].length; col++) {
          const element = newBoard[row][col];

          // Check if the square is occupied by a piece
          if (element !== "") {
            const pieceId = element.props.id;

            // Check if the piece on the square belongs to the opponent
            const isOpponentPiece =
              currentTurn === "white"
                ? pieceId.includes("black")
                : pieceId.includes("white");

            if (isOpponentPiece) {
              // you got checked
              // Get possible positions for the opponent's piece
              const response = possiblePositions({
                draggedPieceId: pieceId,
                currentPosition: { row: row, col: col },
                board: newBoard,
              });

              const kingPosition = [];

              // Check if any of the possible positions attack the current player's king
              const isAttackingKing = response.some(
                ([responseRow, responseCol]) => {
                  const enemy = newBoard[responseRow][responseCol];
                  if (enemy !== "" && enemy.props.id === currentPlayerKingId) {
                    kingPosition.push([responseRow, responseCol]);
                    return true;
                  }
                  return false;
                }
              );

              if (isAttackingKing) {
                // If the current player's king is under attack, return response (check case)
                // response structure
                // {checkApplied: true,makeMove:false, appliedBy: opponent's player id, opponentPlayerRow: 0-7,opponentPlayerCol: 0-7, highlightCheckPath: [[]]}
                return {
                  checkApplied: true,
                  appliedBy: newBoard[row][col],
                  opponentPlayerRow: row,
                  opponentPlayerCol: col,
                  makeMove: false,
                  kingId: currentPlayerKingId,
                  newBoard,
                  targetKingPositionCol: kingPosition[0][1],
                  targetKingPositionRow: kingPosition[0][0],
                  highlightCheckPath: [],
                };
              }
            } else {
              // you are making check
              // Get possible positions for the current's piece
              const response = possiblePositions({
                draggedPieceId: pieceId,
                currentPosition: { row: row, col: col },
                board: newBoard,
              });

              const kingPosition = [];
              // Check if any of the possible positions attack the opponent player's king
              const isAttackingKing = response.some(
                ([responseRow, responseCol]) => {
                  const enemy = newBoard[responseRow][responseCol];
                  if (enemy !== "" && enemy.props.id === opponentPlayerKingId) {
                    kingPosition.push([responseRow, responseCol]);
                    return true;
                  }
                  return false;
                }
              );
              if (isAttackingKing) {
                const highlightCheckPath = findPathToKing({
                  pieceId,
                  piecePositionCol: col,
                  piecePositionRow: row,
                  targetKingPositionCol: kingPosition[0][1],
                  targetKingPositionRow: kingPosition[0][0],
                });

                // If the opponent player's king is under attack, return true (check case)
                return {
                  checkApplied: true,
                  appliedBy: newBoard[row][col],
                  opponentPlayerRow: row,
                  opponentPlayerCol: col,
                  makeMove: true,
                  highlightCheckPath,
                  kingId: opponentPlayerKingId,
                  newBoard,
                  targetKingPositionCol: kingPosition[0][1],
                  targetKingPositionRow: kingPosition[0][0],
                };
              }
            }
          }
        }
      }

      // If no attack on the current player's king is found, return false (no check case)
      return {
        checkApplied: false,
        appliedBy: newBoard[index][id],
        opponentPlayerRow: index,
        opponentPlayerCol: id,
        makeMove: true,
        highlightCheckPath: [],
        kingId: "",
        newBoard,
        targetKingPositionCol: 0,
        targetKingPositionRow: 0,
      };
    },
    [currentTurn]
  );

  const isAppliedCheckMateCase = useCallback(
    ({
      kingId,
      newBoard,
      targetKingPositionCol,
      targetKingPositionRow,
      highlightCheckPath,
    }) => {
      // can king escape
      // Get possible positions for the king's piece
      const response = possiblePositions({
        draggedPieceId: kingId,
        currentPosition: {
          row: targetKingPositionRow,
          col: targetKingPositionCol,
        },
        board: newBoard,
      });

      let flag = true;

      for (let index = 0; index < response.length; index++) {
        let cloneOfMap = deepCloneArray(newBoard);
        cloneOfMap[response[index][0]][response[index][1]] =
          newBoard[targetKingPositionRow][targetKingPositionCol];
        cloneOfMap[targetKingPositionRow][targetKingPositionCol] = "";
        const { checkApplied: a } = isCheckCase(cloneOfMap);

        if (!a) {
          flag = false;
          return;
        }
      }

      // can we bring anyone between king and attacker
      for (let x = 0; x < newBoard.length; x++) {
        for (let y = 0; y < newBoard[x].length; y++) {
          const piece = newBoard[x][y];
          if (piece !== "") {
            const pieceId = piece.props.id;
            const possiblePiecePosition = possiblePositions({
              draggedPieceId: pieceId,
              currentPosition: {
                row: x,
                col: y,
              },
              board: newBoard,
            });
            if (
              (pieceId.includes("black") && kingId.includes("black")) ||
              (pieceId.includes("white") && kingId.includes("white"))
            ) {
              // Convert the arrays to Sets to remove duplicate elements
              const set1 = new Set(possiblePiecePosition);
              const set2 = new Set(highlightCheckPath);

              // Check if any element in set1 exists in set2
              for (const item of set1) {
                if (set2.has(item)) {
                  flag = false;
                  return; // If any common element found, return false
                }
              }
            }
          }
        }
      }

      if (flag) {
        // check & mate
        return true;
      } else {
        // no check & mate
        return false;
      }
    },
    [deepCloneArray, isCheckCase]
  );

  function findHighlightedPositions() {
    const oldPosition = board[index][id];
    let draggedPieceId = oldPosition.props.id;
    const response = possiblePositions({
      draggedPieceId,
      currentPosition: { row: index, col: id },
      board,
    });

    sethighlightedBoxes(response);
  }

  useEffect(() => {
    if (isDragging) {
      findHighlightedPositions();
    } else {
      sethighlightedBoxes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "warrior",
      drop: ({ col, row }) => {
        const prev = deepCloneArray(board);

        const oldPosition = board[row][col];
        let draggedPieceId = oldPosition.props.id;
        const response = possiblePositions({
          draggedPieceId,
          currentPosition: { row: row, col: col },
          board,
        });

        // Check if the current square matches the highlighted boxes
        const shouldHighlight = response.some(([row, col]) => {
          return row === index && col === id;
        });

        const newPosition = prev[index][id];
        if (shouldHighlight) {
          if (!newPosition) {
            let temp = prev[index][id];
            prev[index][id] = prev[row][col];
            prev[row][col] = temp;
          } else {
            if (currentTurn === "white") {
              let temp = prev[index][id];
              prev[index][id] = prev[row][col];
              prev[row][col] = "";
              setplayerBEats((prev) => [...prev, temp]);
              savePlayerBProgress([...playerBEats, temp]);
            } else {
              let temp = prev[index][id];
              prev[index][id] = prev[row][col];
              prev[row][col] = "";
              savePlayerAProgress([...playerAEats, temp]);
              setplayerAEats((prev) => [...prev, temp]);
            }
          }

          const {
            checkApplied,
            appliedBy,
            opponentPlayerRow,
            opponentPlayerCol,
            makeMove,
            kingId,
            newBoard,
            targetKingPositionCol,
            targetKingPositionRow,
            highlightCheckPath,
          } = isCheckCase(prev);

          if (checkApplied) {
            if (
              isAppliedCheckMateCase({
                kingId: kingId,
                newBoard,
                targetKingPositionCol,
                targetKingPositionRow,
                highlightCheckPath,
              })
            ) {
              alert("bro you lose");
            } else {
              alert("check applied");
            }
          }
          if (makeMove) {
            setBoard(prev);
            if (checkApplied) {
              setcurrentClickedPiece([
                appliedBy,
                opponentPlayerRow,
                opponentPlayerCol,
              ]);
              sethighlightedBoxes(highlightCheckPath);
            } else {
              setcurrentClickedPiece([]);
              sethighlightedBoxes([]);
            }
            saveCurrentTurn(currentTurn);
            saveBoardProgress(prev);
            setcurrentTurn((prev) => {
              if (prev === "black") {
                return "white";
              } else {
                return "black";
              }
            });
          } else {
            setcurrentClickedPiece([]);
            sethighlightedBoxes([]);
          }
        }
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
    }),
    [currentTurn]
  );

  const isActive = canDrop && isOver;

  // Check if the current square matches the highlighted boxes
  const shouldHighlight = highlightedBoxes.some(([row, col]) => {
    return row === index && col === id;
  });

  function movePieceOnClick() {
    // Function to handle the click event for moving chess pieces

    const element = board[index][id];

    // Check if the clicked square is not empty
    if (element !== "") {
      const pieceId = element.props.id;

      // Check if the piece belongs to the current player
      if (
        (currentTurn === "black" && pieceId.includes("black")) ||
        (currentTurn === "white" && pieceId.includes("white"))
      ) {
        // Check if the clicked piece is already selected
        if (currentClickedPiece[0] === board[index][id]) {
          // Deselect the piece if already selected
          setcurrentClickedPiece([]);
          sethighlightedBoxes([]);
        } else {
          // Select the clicked piece and highlight valid moves
          setcurrentClickedPiece([board[index][id], index, id]);
          findHighlightedPositions();
        }
      } else if (currentClickedPiece.length > 0 && shouldHighlight) {
        // Move the selected piece to the empty square
        const prev = deepCloneArray(board);
        let temp = prev[index][id];
        // Check if a valid move is selected
        if (board[index][id] === "") {
          prev[index][id] = currentClickedPiece[0];
          prev[currentClickedPiece[1]][currentClickedPiece[2]] = temp;
        } else {
          // Capture the opponent's piece
          prev[index][id] = currentClickedPiece[0];
          prev[currentClickedPiece[1]][currentClickedPiece[2]] = "";
          if (currentTurn === "white") {
            setplayerBEats((prev) => [...prev, temp]);
            savePlayerBProgress([...playerBEats, temp]);
          } else {
            setplayerAEats((prev) => [...prev, temp]);
            savePlayerAProgress([...playerAEats, temp]);
          }
        }

        const {
          checkApplied,
          appliedBy,
          opponentPlayerRow,
          opponentPlayerCol,
          makeMove,
          highlightCheckPath,
          kingId,
          newBoard,
          targetKingPositionCol,
          targetKingPositionRow,
        } = isCheckCase(prev);

        if (checkApplied) {
          if (
            isAppliedCheckMateCase({
              kingId: kingId,
              newBoard,
              targetKingPositionCol,
              targetKingPositionRow,
              highlightCheckPath,
            })
          ) {
            alert("bro you lose");
          } else {
            alert("check applied");
          }
        }
        if (makeMove) {
          // Switch the turn to the next player
          setcurrentTurn((prev) => (prev === "black" ? "white" : "black"));
          saveCurrentTurn(currentTurn);
          // Update the board state
          setBoard(prev);
          saveBoardProgress(prev);
          if (checkApplied) {
            setcurrentClickedPiece([
              appliedBy,
              opponentPlayerRow,
              opponentPlayerCol,
            ]);
            sethighlightedBoxes(highlightCheckPath);
          } else {
            setcurrentClickedPiece([]);
            sethighlightedBoxes([]);
          }
        } else {
          // Clear selected piece and highlighted squares
          setcurrentClickedPiece([]);
          sethighlightedBoxes([]);
        }
      }
    } else {
      // Check if an empty square is clicked after selecting a piece
      if (shouldHighlight && currentClickedPiece.length > 0) {
        // Move the selected piece to the empty square
        const prev = deepCloneArray(board);
        let temp = prev[index][id];
        prev[index][id] = currentClickedPiece[0];
        prev[currentClickedPiece[1]][currentClickedPiece[2]] = temp;

        const {
          checkApplied,
          appliedBy,
          opponentPlayerRow,
          opponentPlayerCol,
          makeMove,
          highlightCheckPath,
          kingId,
          newBoard,
          targetKingPositionCol,
          targetKingPositionRow,
        } = isCheckCase(prev);

        if (checkApplied) {
          if (
            isAppliedCheckMateCase({
              kingId: kingId,
              newBoard,
              targetKingPositionCol,
              targetKingPositionRow,
              highlightCheckPath,
            })
          ) {
            alert("bro you lose");
          } else {
            alert("check applied");
          }
        }

        if (makeMove) {
          // Update the board state
          setcurrentTurn((prev) => (prev === "black" ? "white" : "black"));
          setBoard(newBoard);
          saveCurrentTurn(currentTurn);
          if (checkApplied) {
            setcurrentClickedPiece([
              appliedBy,
              opponentPlayerRow,
              opponentPlayerCol,
            ]);
            sethighlightedBoxes(highlightCheckPath);
          } else {
            setcurrentClickedPiece([]);
            sethighlightedBoxes([]);
          }
          saveBoardProgress(prev);
        } else {
          // Clear selected piece and highlighted squares
          setcurrentClickedPiece([]);
          sethighlightedBoxes([]);
        }
      }
    }
  }

  return (
    <div
      className={`square ${dark ? "dark" : "light"} border square-${
        index * 8 + id
      } ${isActive ? "active" : ""} ${shouldHighlight ? "highlighted" : ""} ${
        currentClickedPiece[0] === board[index][id]
          ? "selected"
          : "not-selected"
      }`}
      onClick={() => {
        movePieceOnClick();
      }}
      key={id}
      ref={drop}
    >
      {square ? (
        <div
          className="square"
          style={{
            opacity: isDragging ? 0.5 : 1,
          }}
          ref={drag}
        >
          {square}
        </div>
      ) : (
        square
      )}
    </div>
  );
};

export default Square;
