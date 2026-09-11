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

let from = '';
let to = ''

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
            square.appendChild(img);
        }
        chessboard.appendChild(square);

        square.addEventListener("click", () => {
            console.log(square.dataset);
            console.log(initialPiece[row][col])
        })
    }
}
let from = 






