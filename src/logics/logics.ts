export function possiblePositions({
  draggedPieceId,
  currentPosition: { row, col },
  board,
}: {
  draggedPieceId: string;
  currentPosition: { row: number; col: number };
  board: (React.JSX.Element[] | string[])[];
}): number[][] {
  switch (draggedPieceId) {
    case "pawn-black":
      return possiblePawn({
        currentPosition: { row, col },
        board,
        color: "black",
      });
    case "pawn-white":
      return possiblePawn({
        currentPosition: { row, col },
        board,
        color: "white",
      });
    case "rook-white":
      return possibleRook({
        currentPosition: { row, col },
        board,
        color: "white",
      });
    case "rook-black":
      return possibleRook({
        currentPosition: { row, col },
        board,
        color: "black",
      });
    case "knight-black":
      return possibleKnight({
        currentPosition: { row, col },
        board,
        color: "black",
      });
    case "knight-white":
      return possibleKnight({
        currentPosition: { row, col },
        board,
        color: "white",
      });
    case "bishop-black":
      return possibleBishop({
        currentPosition: { row, col },
        board,
        color: "black",
      });
    case "bishop-white":
      return possibleBishop({
        currentPosition: { row, col },
        board,
        color: "white",
      });
    case "king-black":
      return possibleKing({
        currentPosition: { row, col },
        board,
        color: "black",
      });
    case "king-white":
      return possibleKing({
        currentPosition: { row, col },
        board,
        color: "white",
      });
    case "queen-black":
      return possibleQueen({
        currentPosition: { row, col },
        board,
        color: "black",
      });
    case "queen-white":
      return possibleQueen({
        currentPosition: { row, col },
        board,
        color: "white",
      });
    default:
      return [];
  }
}

interface PossibleMoves {
  currentPosition: { row: number; col: number };
  board: (React.JSX.Element[] | string[])[];
  color: string;
}

interface HittingKing {
  piecePositionRow: number;
  piecePositionCol: number;
  path: number[][];
  targetKingPositionRow: number;
  targetKingPositionCol: number;
}

function possibleQueen({
  currentPosition: { row, col },
  board,
  color,
}: PossibleMoves) {
  const possibles: number[][] = [];

  if (color === "white") {
    const whiteKing = possibleKing({
      currentPosition: { row, col },
      board,
      color: "white",
    });
    possibles.push(...whiteKing);
    const whiteBishop = possibleBishop({
      currentPosition: { row, col },
      board,
      color: "white",
    });
    possibles.push(...whiteBishop);
    const whiteRook = possibleRook({
      currentPosition: { row, col },
      board,
      color: "white",
    });
    possibles.push(...whiteRook);
    const whitePawn = possiblePawn({
      currentPosition: { row, col },
      board,
      color: "white",
    });
    possibles.push(...whitePawn);
  } else {
    const blackKing = possibleKing({
      currentPosition: { row, col },
      board,
      color: "black",
    });
    possibles.push(...blackKing);
    const blackBishop = possibleBishop({
      currentPosition: { row, col },
      board,
      color: "black",
    });
    possibles.push(...blackBishop);
    const blackRook = possibleRook({
      currentPosition: { row, col },
      board,
      color: "black",
    });
    possibles.push(...blackRook);
    const blackPawn = possiblePawn({
      currentPosition: { row, col },
      board,
      color: "black",
    });
    possibles.push(...blackPawn);
  }
  return possibles;
}

function possibleKing({
  currentPosition: { row, col },
  board,
  color,
}: PossibleMoves): number[][] {
  const possibles: number[][] = [];

  function checkPossibles(rowIndex: number, colIndex: number): void {
    if (rowIndex >= 0 && rowIndex <= 7 && colIndex >= 0 && colIndex <= 7) {
      const element = board[rowIndex][colIndex];
      if (element === "" && typeof element === "string") {
        possibles.push([rowIndex, colIndex]);
      } else {
        const pieceId = (element as JSX.Element).props.id;

        const isOpponent =
          (color === "white" && pieceId.includes("black")) ||
          (color === "black" && pieceId.includes("white"));

        if (isOpponent) {
          possibles.push([rowIndex, colIndex]);
        }
      }
    }
  }

  // top
  checkPossibles(row - 1, col);
  // bottom
  checkPossibles(row + 1, col);
  // left
  checkPossibles(row, col - 1);
  // right
  checkPossibles(row, col + 1);
  // top-right
  checkPossibles(row - 1, col + 1);
  // bottom-right
  checkPossibles(row + 1, col + 1);
  // bottom-left
  checkPossibles(row + 1, col - 1);
  // top-left
  checkPossibles(row - 1, col - 1);

  return possibles;
}

function possibleBishop({
  currentPosition: { row, col },
  board,
  color,
}: PossibleMoves): number[][] {
  const possibles: number[][] = [];

  function checkPossibles(
    rowIndex: number,
    colIndex: number,
    rowDirection: number,
    colDirection: number
  ): void {
    while (rowIndex >= 0 && rowIndex <= 7 && colIndex >= 0 && colIndex <= 7) {
      const element = board[rowIndex][colIndex];
      if (element === "") {
        possibles.push([rowIndex, colIndex]);
      } else {
        const pieceId = (element as JSX.Element).props.id;
        const isOpponent =
          (color === "white" && pieceId.includes("black")) ||
          (color === "black" && pieceId.includes("white"));

        if (isOpponent) {
          possibles.push([rowIndex, colIndex]);
          break;
        } else {
          break;
        }
      }
      rowIndex += rowDirection;
      colIndex += colDirection;
    }
  }

  // top-right
  checkPossibles(row - 1, col + 1, -1, +1);

  // top-left
  checkPossibles(row - 1, col - 1, -1, -1);

  // bottom-right
  checkPossibles(row + 1, col + 1, +1, +1);

  // bottom-left
  checkPossibles(row + 1, col - 1, +1, -1);

  return possibles;
}

function possibleKnight({
  currentPosition: { row, col },
  board,
  color,
}: PossibleMoves): number[][] {
  const possibles: number[][] = [];

  function checkPossibles(rowIndex: number, colIndex: number): void {
    if (rowIndex >= 0 && rowIndex <= 7 && colIndex >= 0 && colIndex <= 7) {
      const element = board[rowIndex][colIndex];
      if (element === "") {
        possibles.push([rowIndex, colIndex]);
      } else {
        const pieceId = (element as JSX.Element).props.id;
        const isOpponent: boolean =
          (color === "white" && pieceId.includes("black")) ||
          (color === "black" && pieceId.includes("white"));

        if (isOpponent) {
          possibles.push([rowIndex, colIndex]);
        }
      }
    }
  }

  // top-left
  checkPossibles(row - 2, col - 1);

  // top-right
  checkPossibles(row - 2, col + 1);

  // bottom-right
  checkPossibles(row + 2, col + 1);

  // bottom-left
  checkPossibles(row + 2, col - 1);

  // right-top
  checkPossibles(row - 1, col + 2);

  // right-bottom
  checkPossibles(row + 1, col + 2);

  // left-bottom
  checkPossibles(row + 1, col - 2);

  // left-top
  checkPossibles(row - 1, col - 2);

  return possibles;
}

function possibleRook({
  currentPosition: { row, col },
  board,
  color,
}: PossibleMoves): number[][] {
  const possibles: number[][] = [];

  const checkDirection = (
    start: number[],
    stepRow: number,
    stepCol: number
  ): void => {
    let [rowIndex, colIndex] = start;
    while (rowIndex >= 0 && rowIndex <= 7 && colIndex >= 0 && colIndex <= 7) {
      const element = board[rowIndex][colIndex];
      if (element === "") {
        possibles.push([rowIndex, colIndex]);
      } else {
        const pieceId = (element as JSX.Element).props.id;
        const isOpponent =
          (color === "white" && pieceId.includes("black")) ||
          (color === "black" && pieceId.includes("white"));
        if (isOpponent) {
          possibles.push([rowIndex, colIndex]);
        }
        break;
      }
      rowIndex += stepRow;
      colIndex += stepCol;
    }
  };

  // Check left direction
  checkDirection([row, col - 1], 0, -1);

  // Check right direction
  checkDirection([row, col + 1], 0, 1);

  // Check top direction
  checkDirection([row - 1, col], -1, 0);

  // Check bottom direction
  checkDirection([row + 1, col], 1, 0);

  return possibles;
}

function possiblePawn({
  currentPosition: { row, col },
  board,
  color,
}: PossibleMoves): number[][] {
  const possibles: number[][] = [];
  const nextRow = color === "white" ? row - 1 : row + 1; // Determine the next row based on pawn color
  const leftCol = col - 1;
  const rightCol = col + 1;
  const nextRowIsEmpty = board[nextRow][col] === ""; // Check if the next row is empty
  const leftColExists = leftCol >= 0;
  const rightColExists = rightCol <= 7;

  // Function to check if there's an enemy piece on the side
  function checkSide(sideCol: number, enemyColor: string): void {
    if (board[nextRow][sideCol] !== "") {
      const sidePiece = board[nextRow][sideCol];
      const sidePieceId = (sidePiece as JSX.Element).props.id;
      if (sidePieceId.includes(enemyColor)) {
        possibles.push([nextRow, sideCol]); // Add the position if an enemy piece is present
      }
    }
  }

  // Check possible moves for the pawn
  if (nextRowIsEmpty) {
    if (leftColExists && board[nextRow][leftCol] !== "") {
      checkSide(leftCol, color === "white" ? "black" : "white"); // Check left side for enemy pieces
    }
    if (rightColExists && board[nextRow][rightCol] !== "") {
      checkSide(rightCol, color === "white" ? "black" : "white"); // Check right side for enemy pieces
    }
    possibles.push([nextRow, col]); // Add the position of a single forward move

    // Check for double jump if pawn is in starting position
    const doubleJumpRow = color === "white" ? row - 2 : row + 2;
    if (
      board[nextRow][col] === "" &&
      ((color === "white" && row === 6 && board[doubleJumpRow][col] === "") ||
        (color === "black" && row === 1 && board[doubleJumpRow][col] === ""))
    ) {
      if (leftColExists && board[nextRow][leftCol] !== "") {
        checkSide(leftCol, color === "white" ? "black" : "white"); // Check left side for enemy pieces
      }
      if (rightColExists && board[nextRow][rightCol] !== "") {
        checkSide(rightCol, color === "white" ? "black" : "white"); // Check right side for enemy pieces
      }
      possibles.push([doubleJumpRow, col]); // Add the position of a double forward move
    }
  } else {
    if (leftColExists && board[nextRow][leftCol] !== "") {
      checkSide(leftCol, color === "white" ? "black" : "white"); // Check left side for enemy pieces
    }
    if (rightColExists && board[nextRow][rightCol] !== "") {
      checkSide(rightCol, color === "white" ? "black" : "white"); // Check right side for enemy pieces
    }
  }

  return possibles;
}

function isPawnHittingKing({
  piecePositionRow,
  piecePositionCol,
  path,
  targetKingPositionRow,
  targetKingPositionCol,
}: HittingKing): number[][] {
  // top-left
  if (piecePositionRow - 1 >= 0 && piecePositionCol - 1 >= 0) {
    if (
      piecePositionRow - 1 === targetKingPositionRow &&
      piecePositionCol - 1 === targetKingPositionCol
    ) {
      path.push([piecePositionRow - 1, piecePositionCol - 1]);
    }
  }
  // top-right
  if (piecePositionRow - 1 >= 0 && piecePositionCol + 1 <= 7) {
    if (
      piecePositionRow - 1 === targetKingPositionRow &&
      piecePositionCol + 1 === targetKingPositionCol
    ) {
      path.push([piecePositionRow - 1, piecePositionCol + 1]);
    }
  }
  // bottom-right
  if (piecePositionRow + 1 <= 7 && piecePositionCol + 1 <= 7) {
    if (
      piecePositionRow + 1 === targetKingPositionRow &&
      piecePositionCol + 1 === targetKingPositionCol
    ) {
      path.push([piecePositionRow + 1, piecePositionCol + 1]);
    }
  }
  // bottom-left
  if (piecePositionRow + 1 <= 7 && piecePositionCol - 1 >= 0) {
    if (
      piecePositionRow + 1 === targetKingPositionRow &&
      piecePositionCol - 1 === targetKingPositionCol
    ) {
      path.push([piecePositionRow + 1, piecePositionCol - 1]);
    }
  }

  return path;
}

function isRookHittingKing({
  piecePositionRow,
  piecePositionCol,
  path,
  targetKingPositionRow,
  targetKingPositionCol,
}: HittingKing): number[][] {
  // if current and target are on same row
  if (targetKingPositionRow === piecePositionRow) {
    if (targetKingPositionCol < piecePositionCol) {
      for (
        let index = piecePositionCol - 1;
        index >= targetKingPositionCol;
        index--
      ) {
        path.push([targetKingPositionRow, index]);
      }
    } else {
      for (
        let index = piecePositionCol + 1;
        index <= targetKingPositionCol;
        index++
      ) {
        path.push([targetKingPositionRow, index]);
      }
    }
  }

  // if current and target are on same col
  if (targetKingPositionCol === piecePositionCol) {
    if (targetKingPositionRow < piecePositionRow) {
      for (
        let index = piecePositionRow - 1;
        index >= targetKingPositionRow;
        index--
      ) {
        path.push([index, targetKingPositionCol]);
      }
    } else {
      for (
        let index = piecePositionRow + 1;
        index <= targetKingPositionRow;
        index++
      ) {
        path.push([index, targetKingPositionCol]);
      }
    }
  }
  return path;
}

function isQueenHittingKing({
  piecePositionRow,
  piecePositionCol,
  path,
  targetKingPositionRow,
  targetKingPositionCol,
}: HittingKing): number[][] {
  const pawnMoves = isPawnHittingKing({
    piecePositionRow,
    piecePositionCol,
    path,
    targetKingPositionRow,
    targetKingPositionCol,
  });

  const kingMoves = isKingHittingKing({
    piecePositionRow,
    piecePositionCol,
    path,
    targetKingPositionRow,
    targetKingPositionCol,
  });

  const rookMoves = isRookHittingKing({
    piecePositionRow,
    piecePositionCol,
    path,
    targetKingPositionRow,
    targetKingPositionCol,
  });

  const bishopMoves = isBishopHittingKing({
    piecePositionRow,
    piecePositionCol,
    path,
    targetKingPositionRow,
    targetKingPositionCol,
  });

  path.concat(bishopMoves, rookMoves, kingMoves, pawnMoves);

  return path;
}

function isKnightHittingKing({
  piecePositionRow,
  piecePositionCol,
  path,
  targetKingPositionRow,
  targetKingPositionCol,
}: HittingKing): number[][] {
  // top-left
  if (
    piecePositionRow - 2 === targetKingPositionRow &&
    piecePositionCol - 1 === targetKingPositionCol
  ) {
    path.push([piecePositionRow - 2, piecePositionCol - 1]);
  }

  // top-right
  if (
    piecePositionRow - 2 === targetKingPositionRow &&
    piecePositionCol + 1 === targetKingPositionCol
  ) {
    path.push([piecePositionRow - 2, piecePositionCol + 1]);
  }

  // right-top
  if (
    piecePositionRow - 1 === targetKingPositionRow &&
    piecePositionCol + 2 === targetKingPositionCol
  ) {
    path.push([piecePositionRow - 1, piecePositionCol + 2]);
  }

  // right-bottom
  if (
    piecePositionRow + 1 === targetKingPositionRow &&
    piecePositionCol + 2 === targetKingPositionCol
  ) {
    path.push([piecePositionRow - 1, piecePositionCol + 2]);
  }

  // bottom-right
  if (
    piecePositionRow + 2 === targetKingPositionRow &&
    piecePositionCol + 1 === targetKingPositionCol
  ) {
    path.push([piecePositionRow + 2, piecePositionCol + 1]);
  }

  // bottom-left
  if (
    piecePositionRow + 2 === targetKingPositionRow &&
    piecePositionCol - 1 === targetKingPositionCol
  ) {
    path.push([piecePositionRow + 2, piecePositionCol - 1]);
  }

  // left-bottom
  if (
    piecePositionRow + 1 === targetKingPositionRow &&
    piecePositionCol - 2 === targetKingPositionCol
  ) {
    path.push([piecePositionRow + 1, piecePositionCol - 2]);
  }

  // left-top
  if (
    piecePositionRow - 1 === targetKingPositionRow &&
    piecePositionCol - 2 === targetKingPositionCol
  ) {
    path.push([piecePositionRow - 1, piecePositionCol - 2]);
  }
  return path;
}

function isBishopHittingKing({
  piecePositionRow,
  piecePositionCol,
  path,
  targetKingPositionRow,
  targetKingPositionCol,
}: HittingKing): number[][] {
  function checkBottomLeft(
    rowIndex: number,
    colIndex: number,
    rowDirection: number,
    colDirection: number
  ): void {
    while (
      rowIndex <= targetKingPositionRow &&
      colIndex >= targetKingPositionCol
    ) {
      path.push([rowIndex, colIndex]);

      rowIndex += rowDirection;
      colIndex += colDirection;
    }
  }
  function checkBottomRight(
    rowIndex: number,
    colIndex: number,
    rowDirection: number,
    colDirection: number
  ): void {
    while (
      rowIndex <= targetKingPositionRow &&
      colIndex <= targetKingPositionCol
    ) {
      path.push([rowIndex, colIndex]);
      rowIndex += rowDirection;
      colIndex += colDirection;
    }
  }
  function checkTopLeft(
    rowIndex: number,
    colIndex: number,
    rowDirection: number,
    colDirection: number
  ): void {
    while (
      rowIndex >= targetKingPositionRow &&
      colIndex >= targetKingPositionCol
    ) {
      path.push([rowIndex, colIndex]);

      rowIndex += rowDirection;
      colIndex += colDirection;
    }
  }
  function checkTopRight(
    rowIndex: number,
    colIndex: number,
    rowDirection: number,
    colDirection: number
  ): void {
    while (
      rowIndex >= targetKingPositionRow &&
      colIndex <= targetKingPositionCol
    ) {
      path.push([rowIndex, colIndex]);

      rowIndex += rowDirection;
      colIndex += colDirection;
    }
  }
  // top-right
  checkTopRight(piecePositionRow - 1, piecePositionCol + 1, -1, +1);

  // top-left
  checkTopLeft(piecePositionRow - 1, piecePositionCol - 1, -1, -1);

  // bottom-right
  checkBottomRight(piecePositionRow + 1, piecePositionCol + 1, +1, +1);

  // bottom-left
  checkBottomLeft(piecePositionRow + 1, piecePositionCol - 1, +1, -1);

  return path;
}

function isKingHittingKing({
  piecePositionRow,
  piecePositionCol,
  path,
  targetKingPositionRow,
  targetKingPositionCol,
}: HittingKing) {
  // vertical
  if (piecePositionCol === targetKingPositionCol) {
    if (piecePositionRow - 1 === targetKingPositionRow) {
      path.push([piecePositionRow - 1, piecePositionCol]);
    }
    if (piecePositionRow + 1 === targetKingPositionRow) {
      path.push([piecePositionRow + 1, piecePositionCol]);
    }
  }

  // horizontal
  if (piecePositionRow === targetKingPositionRow) {
    if (piecePositionCol - 1 === targetKingPositionCol) {
      path.push([piecePositionRow, piecePositionCol - 1]);
    }
    if (piecePositionCol + 1 === targetKingPositionCol) {
      path.push([piecePositionRow, piecePositionCol + 1]);
    }
  }

  // right-diagonal-top
  if (
    piecePositionRow - 1 === targetKingPositionRow &&
    piecePositionCol + 1 === targetKingPositionCol
  ) {
    path.push([piecePositionRow - 1, piecePositionCol + 1]);
  }

  // right-diagonal-bottom
  if (
    piecePositionRow + 1 === targetKingPositionRow &&
    piecePositionCol + 1 === targetKingPositionCol
  ) {
    path.push([piecePositionRow + 1, piecePositionCol + 1]);
  }

  // left-diagonal-bottom
  if (
    piecePositionRow + 1 === targetKingPositionRow &&
    piecePositionCol - 1 === targetKingPositionCol
  ) {
    path.push([piecePositionRow + 1, piecePositionCol - 1]);
  }

  // left-diagonal-top
  if (
    piecePositionRow - 1 === targetKingPositionRow &&
    piecePositionCol - 1 === targetKingPositionCol
  ) {
    path.push([piecePositionRow - 1, piecePositionCol - 1]);
  }

  return path;
}

export function findPathToKing({
  piecePositionRow,
  piecePositionCol,
  pieceId,
  targetKingPositionRow,
  targetKingPositionCol,
}: {
  piecePositionRow: number;
  piecePositionCol: number;
  pieceId: string;
  targetKingPositionRow: number;
  targetKingPositionCol: number;
}): number[][] {
  const path: number[][] = [];
  switch (pieceId) {
    case "pawn-black":
      return isPawnHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "pawn-white":
      return isPawnHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "rook-white":
      return isRookHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "rook-black":
      return isRookHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "knight-black":
      return isKnightHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "knight-white":
      return isKnightHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "bishop-black":
      return isBishopHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "bishop-white":
      return isBishopHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "king-black":
      return isKingHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "king-white":
      return isKingHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "queen-black":
      return isQueenHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    case "queen-white":
      return isQueenHittingKing({
        piecePositionRow,
        piecePositionCol,
        targetKingPositionCol,
        targetKingPositionRow,
        path,
      });
    default:
      return path;
  }
}
