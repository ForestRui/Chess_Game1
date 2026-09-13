const chessboard = document.getElementById('chessboard');

const initialPiece = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
]

const pieceMap = {
    br: 'black-rook.png',
    bn: 'black-knight.png',
    bb: 'black-bishop.png',
    bq: 'black-queen.png',
    bk: 'black-king.png',
    bp: 'black-pawn.png',
    wr: 'white-rook.png',
    wn: 'white-knight.png',
    wb: 'white-bishop.png',
    wk: 'white-king.png',
    wq: 'white-queen.png',
    wp: 'white-pawn.png',
}

let from;
let to;
let selectedRow;
let selectedCol;
let selectedPiece;
let selected = false;
let currentTurn = "w";
let selectedColor;
let enemyColor;
let selectTurn;

let leftWhiteRookMoved = false;
let rightWhiteRookMoved = false;
let whiteKingMoved = false;

let leftBlackRookMoved = false;
let rightBlackRookMoved = false;
let blackKingMoved = false;



for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.row = row;
        square.dataset.col = col;
        if ((row + col) % 2 === 0) {
           square.classList.add("white");
        } else {
            square.classList.add("black");
        }

        const piece = initialPiece[row][col];
        if (piece) {
            const img = document.createElement('img');
            img.src = `src/pieces/${pieceMap[piece]}`;
            img.alt = piece;
            img.classList.add('piece');

          if (row <= 1) {
            img.setAttribute("piece-color", "black");
          } else if (row >= 6) {
            img.setAttribute("piece-color", "white");
          } 
            square.appendChild(img);
        }
        chessboard.appendChild(square);


        square.addEventListener("click", () => {
            if (initialPiece[row][col] && !selected) {
                selectTurn = initialPiece[row][col].slice(0, 1);
            }
            console.log(square.dataset);
            console.log(initialPiece[row][col])

            if (selectTurn !== currentTurn) {
                console.log("Not your turn");
                return
            }

            if (selectTurn === currentTurn && !selected) {
                selectedRow = row;
                selectedCol = col;
                from = `row ${row} col ${col}`;
                selected = true;
                selectedColor = initialPiece[row][col].slice(0, 1);
                enemyColor = selectedColor === 'w' ? 'b' : 'w';
                console.log("selected")
                selectedPiece = initialPiece[row][col];
                const pieceImage = square.querySelector('img');
                pieceImage.classList.toggle("selected");
                return
            } else if (selectedRow === row && selectedCol === col && selected) {
                selected = false;
                console.log("selection cancelled");
                const pieceImage = square.querySelector('img');
                pieceImage.classList.toggle("selected");
                return
            }
              const valid = isValidMove(selectedPiece, selectedRow, selectedCol, row, col, initialPiece[row][col]);
              const safe = noExposure(selectedPiece, selectedRow, selectedCol, row, col, initialPiece[row][col]);
              const castle = castlingBoolean(selectedPiece, selectedRow, selectedCol, row, col);

              if (selected && castle) {
                 let direction = selectedCol > col ? 1 : -1; //direc of rook//
                let rookCol = selectedCol > col ? 0 : 7;
                let kingRow = selectTurn === 'w' ? 7 : 0;
                    initialPiece[row][col + direction] = initialPiece[kingRow][rookCol];
                    const oldRookSquare = document.querySelector(`[data-row="${kingRow}"][data-col="${rookCol}"]`);
                    const rookPiece = oldRookSquare.querySelector('img');
                    const newRookSquare = document.querySelector(`[data-row="${row}"][data-col="${col + direction}"]`)
                    newRookSquare.appendChild(rookPiece);
                    initialPiece[kingRow][rookCol] = null;
                    console.log("castling executed");
                    selected = false;

                   const oldSquare = document.querySelector(`[data-row="${selectedRow}"][data-col="${selectedCol}"]`);
             const movePiece = oldSquare.querySelector('img');
             movePiece.classList.toggle('selected');
             square.appendChild(movePiece);
             console.log('piece:', selectedPiece);
            console.log('safe:', safe);
             if (currentTurn === "w") {
                currentTurn = "b";
            } else {
                currentTurn = "w"
            }

             if (selectedPiece === 'br' && selectedCol === 0) {
                if (selectedCol === 0) leftBlackRookMoved = true;  
                if (selectedCol === 7) rightBlackRookMoved = true;  
            }
            if (selectedPiece === 'bk') {
               blackKingMoved = true
            }

            if (selectedPiece === 'wr' && selectedCol === 7) {
                if (selectedCol === 0) leftWhiteRookMoved = true;  
                if (selectedCol === 7) rightWhiteRookMoved = true;  
            }
            if (selectedPiece === 'wk') {
                whiteKingMoved = true;
            }
            if (!hasLegalMove(enemyColor)) {
                const fullSpell = selectedColor === 'w' ? 'White' : 'Black';
                if (isKingInChecked(enemyColor)) {
                 alert(`Checkmate! ${fullSpell} side won!`)
                } else {
                 alert ('Stalemate!')
                }
            }
            return 
              }

            if (selected && valid && safe) {
             initialPiece[row][col] = selectedPiece;
             initialPiece[selectedRow][selectedCol] = null;

             to = `row ${row} col ${col}`;
             selected = false;
             const oldSquare = document.querySelector(`[data-row="${selectedRow}"][data-col="${selectedCol}"]`);
             const movePiece = oldSquare.querySelector('img');
             movePiece.classList.toggle('selected');
             const capturePiece = square.querySelector('img');
             if (capturePiece) {
                capturePiece.remove(); //man!//
             }
            square.appendChild(movePiece);
            console.log('piece:', selectedPiece);
            console.log('valid:', valid);
            console.log('safe:', safe);
             if (currentTurn === "w") {
                currentTurn = "b";
            } else {
                currentTurn = "w"
            }

            

             if (initialPiece[row][col] === "wp" && row === 0) {
                initialPiece[row][col] = 'wq';
                const img = square.querySelector('img');
                img.src = `src/pieces/${pieceMap.wq}`;
                img.alt = 'wq';
                console.log("Promotion executed");
            }if (initialPiece[row][col] === "bp" && row === 7) {
                initialPiece[row][col] = 'bq';
                const img = square.querySelector('img');
                img.src = `src/pieces/${pieceMap.bq}`;
                img.alt = 'bq';
                console.log("Promotion executed");
            }

            if (selectedPiece === 'br' && selectedCol === 0) {
                if (selectedCol === 0) leftBlackRookMoved = true;  
                if (selectedCol === 7) rightBlackRookMoved = true;  
            }
            if (selectedPiece === 'bk') {
               blackKingMoved = true
            }

            if (selectedPiece === 'wr' && selectedCol === 7) {
                if (selectedCol === 0) leftWhiteRookMoved = true;  
                if (selectedCol === 7) rightWhiteRookMoved = true;  
            }
            if (selectedPiece === 'wk') {
                whiteKingMoved = true;
            }
             if (!hasLegalMove(enemyColor)) {
                const fullSpell = selectedColor === 'w' ? 'White' : 'Black';
                if (isKingInChecked(enemyColor)) {
                 alert (`Checkmate! ${fullSpell} side won!`)
                } else {
                 alert ('Stalemate!')
                }
            return
            } else if (selected) {
             selected = false;
             const oldSquare = document.querySelector(`[data-row="${selectedRow}"][data-col="${selectedCol}"]`)
             const movePiece = oldSquare.querySelector('img');
             movePiece.classList.toggle('selected');
             console.log('piece:', selectedPiece);
            console.log('valid:', valid);
            console.log('safe:', safe);
             return
            }
        }
    })
    }
}


function isValidMove(piece, fromRow, fromCol, toRow, toCol, targetPiece) {
    let targetColor;
    let pieceColor;
    if (initialPiece[fromRow][fromCol]) {
     pieceColor = initialPiece[fromRow][fromCol].slice(0, 1);
    }
    if (targetPiece) {
     targetColor = initialPiece[toRow][toCol].slice(0, 1);
    }
    const sameColor = pieceColor === targetColor;
 if (piece === "wr" || piece === "br") {
    if(fromCol === toCol && fromRow !== toRow) {
        const distance = Math.abs(toRow - fromRow);
        const direction = toRow > fromRow ? 1 : -1;
        for (let i = 1; i < distance; i++) {
            const checkPiece = initialPiece[fromRow + i * direction][fromCol];
            if (checkPiece) {
                return false;
            }
        } 
        if (!sameColor) {
            return true
        }
        return false
    } else if (fromCol !== toCol && fromRow === toRow) {
        const distance = Math.abs(toCol - fromCol);
        const direction = toCol > fromCol ? 1 : -1;
        for (let i = 1; i < distance; i++) {
            const checkPiece = initialPiece[fromRow][fromCol + i * direction];
            if (checkPiece) {
                return false;
            }
        } 
        if (!sameColor) {
            return true
        }
        return false
    } else {
        return false;
    }
 }

 if (piece === "bp") {
    const colChange = Math.abs(fromCol - toCol);
    if (fromRow + 2 === toRow && fromRow === 1 && fromCol === toCol) {
        if (initialPiece[toRow - 1][toCol] || initialPiece[toRow][toCol]) {
            return false;
        }
        return true;
    } else if (fromRow + 1 === toRow && fromCol === toCol) {
        if (initialPiece[toRow][toCol]) {
            return false
        }
        return true;
    } else if (targetPiece && !sameColor && fromRow + 1 === toRow && colChange === 1) {
        return true;
    } else {
        return false;
    }
 }

 if (piece === "wp") {
     const colChange = Math.abs(fromCol - toCol);
    if (fromRow - 2 === toRow && fromRow === 6 && fromCol === toCol) {
        if (initialPiece[toRow + 1][toCol] || initialPiece[toRow][toCol]) {
            return false;
        }
        return true;
    } else if (fromRow - 1 === toRow && fromCol === toCol) {
        if (initialPiece[toRow][toCol]) {
            return false
        }
        return true;
    } else if (targetPiece && !sameColor && fromRow - 1 === toRow && colChange === 1) {
        return true;
    } else {
        return false;
    }
 }

 if (piece === "wb" || piece === "bb") {
    const rowChange = Math.abs(toRow - fromRow);
    const colChange = Math.abs(toCol - fromCol);
    const rowDirection = toRow > fromRow ? 1 : -1;
    const colDirection = toCol > fromCol ? 1 : -1;
    if (rowChange === colChange) {
        for (let i = 1; i < rowChange; i++) {
            const checkPiece = initialPiece[fromRow + i * rowDirection][fromCol + i * colDirection];
            if (checkPiece) {
                return false
            }
        }
        if (!sameColor) {
            return true
        }
        return false
    } else {
        return false;
    }
 }

 if (piece === "wn" || piece === "bn") {
    const rowChange = Math.abs(toRow - fromRow);
    const colChange = Math.abs(toCol - fromCol);
    if ((rowChange === 2 && colChange === 1) || (rowChange === 1 && colChange === 2)) {
      if (sameColor) {
       return false
      } else {
        return true
      }
    }
 }

   if (piece === "bq" || piece === "wq") {
    const rowChange = Math.abs(toRow - fromRow);
    const colChange = Math.abs(toCol - fromCol);
    const rowDirection = toRow > fromRow ? 1 : -1;
    const colDirection = toCol > fromCol ? 1 : -1;
    if (rowChange === colChange) {
        for (let i = 1; i < rowChange; i++) {
            const checkPiece = initialPiece[fromRow + i * rowDirection][fromCol + i * colDirection];
            if (checkPiece) {
                return false
            }
        }
        if (!sameColor) {
            return true
        }
        return false
    } else if(fromCol === toCol && fromRow !== toRow) {
        for (let i = 1; i < rowChange; i++) {
            const checkPiece = initialPiece[fromRow + i * rowDirection][fromCol];
            if (checkPiece) {
                return false
            }
        }
        if (!sameColor) {
            return true;
        }
        return false
    } else if (fromCol !== toCol && fromRow === toRow) {
        for (let i = 1; i < colChange; i++) {
            const checkPiece = initialPiece[fromRow][fromCol + i * colDirection];
            if (checkPiece) {
                return false
            }
        }
        if (!sameColor) {
            return true;
        }
        return false
   } else {
    return false;
   }
 } 
   if (piece === "wk" || piece === "bk") {
    const rowChange = Math.abs(toRow - fromRow);
    const colChange = Math.abs(toCol - fromCol);
    if ((rowChange === 1 || colChange === 1) && rowChange + colChange === 1) {
        if (!sameColor) {
        return true;
        }
    } else if ((rowChange === 1 && colChange === 1)) {
        if (!sameColor) {
        return true;
        }
    } else {
        return false;
    }
   }

}

function isKingInChecked(color) {
  const enemy = color === "w"? "b" : "w";
  const kingRow = initialPiece.findIndex(arr => arr.includes(color + "k"));
  const kingCol = initialPiece[kingRow].indexOf(color + "k");
 

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        if (initialPiece[row][col]) {
        if (initialPiece[row][col].slice(0, 1) === enemy) {
            const checkPiece = initialPiece[row][col];
            if (isValidMove(checkPiece, row, col, kingRow, kingCol, initialPiece[kingRow][kingCol])) {
              console.log('checked');
             return true;
            }
        } }
    }

  }

 return false
  
}


function hasLegalMove(color) {
    if (isKingInChecked(color)) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (initialPiece[row][col]) {
            if (initialPiece[row][col].slice(0, 1) === color) {
                const ownPiece = initialPiece[row][col];
                 for (let squareRow = 0; squareRow < 8; squareRow++) {
                    for (let squareCol = 0; squareCol < 8; squareCol++) {
                    const square = initialPiece[squareRow][squareCol];
                    if (isValidMove(ownPiece, row, col, squareRow, squareCol, square)) {
                        initialPiece[row][col] = null;
                        initialPiece[squareRow][squareCol] = ownPiece;
                        if (!isKingInChecked(color)) {
                            console.log("legal move")
                            initialPiece[row][col] = ownPiece;
                            initialPiece[squareRow][squareCol] = square;
                            return true;
                        } else {
                            console.log('illegal move');
                            initialPiece[row][col] = ownPiece;
                            initialPiece[squareRow][squareCol] = square;
                        }
                    }
                 }
                }
            }
        }
      }
    }
    }

    return false
}

function noExposure(piece, fromRow, fromCol, toRow, toCol, targetPiece) {
    let color;
    if (initialPiece[fromRow][fromCol]) {
         color = initialPiece[fromRow][fromCol].slice(0, 1);
    } else {
        return false
    }
     initialPiece[toRow][toCol] = piece;
     initialPiece[fromRow][fromCol] = null;
       const isKingExposed = isKingInChecked(color);
        initialPiece[toRow][toCol] = targetPiece;
        initialPiece[fromRow][fromCol] = piece;
        if (isKingExposed) {
        console.log("king exposed:", isKingExposed);
        }
    return !isKingExposed
    
}


function castlingBoolean(piece, fromRow, fromCol, toRow, toCol) {
    let rookCol;
    let rookMoved;
    let kingMoved;
    let color;
    if (initialPiece[fromRow][fromCol]) {
        color = initialPiece[fromRow][fromCol].slice(0, 1);
    }
    if (piece !== "wk" && piece !== "bk") {
        return false;
    }
     
    const colDistance = Math.abs(fromCol - toCol);
    if (fromRow !== toRow || colDistance !== 2) {
        return false;
    }

    const direction = fromCol > toCol ? -1 : 1;
    let i = 1;
    let k = 1;
    if (direction < 0) {
    while (i < 3) {
        if (!noExposure(piece, fromRow, fromCol, toRow, fromCol + i * direction, initialPiece[toRow][toCol])) {
             return false;
            } //path not safe//
        i++
    }
    while (k < 4) {
        if (initialPiece[fromRow][fromCol + k * direction]) { 
            return false;
        }//path not clear//
        k++
    }
    } else {
      while (i < 3) {
        if (!noExposure(piece, fromRow, fromCol, toRow, fromCol + i * direction, initialPiece[toRow][toCol])) {
             return false;
            } //path not safe//
        i++
    }
    while (k < 3) {
        if (initialPiece[fromRow][fromCol + k * direction]) { 
            return false;
        }//path not clear//
        k++
    }
    }
     if (piece === 'wk') {
      kingMoved = whiteKingMoved;
      if (direction > 0) {
        rookMoved = rightWhiteRookMoved;
        rookCol = 7;
      } else {
        rookMoved = leftWhiteRookMoved;
        rookCol = 0;
      }
    } 
    if (piece === 'bk') {
        kingMoved = blackKingMoved;
        if (direction > 0) {
         rookMoved = rightBlackRookMoved;
         rookCol = 7
        } else {
            rookMoved = leftBlackRookMoved;
            rookCol = 0;
        }
    }

    if (!rookMoved && !kingMoved) {
        if (!isKingInChecked(color)) {
            return true

        }
    }


}

function isCheckmate(color) {
  const enemyColor = color === 'w' ? 'b' : 'w';
  if (isKingInChecked(enemyColor) && !hasLegalMove(enemyColor)) {
alert('Checkmate!')
return true
  }
  return false;
}