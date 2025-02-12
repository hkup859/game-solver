// Triangle game with pegs where you must end with the fewest number of pegs.

// total pegs = 1+2+3+4+5


const generateBoard = () => {
    const board: any[][] = []
    for(let i = 0; i < 5; i++) {
        const row: any[] = []
        for(let k = 0; k < i+1; k++) {
            row.push('x')
        }
        board.push(row)
    }
    return board
}

const generateBoard2 = () => {
    const boardKey = [1,2,3,4,5]
    const board: {value: string, position: number}[] = []
    for(let i = 1; i <= 15; i++) {
        board.push({value: 'x', position: i})
    }
    return { board, boardKey}
}

// const board = [[1], [1,1],[1,1,1],[1,1,0,1],[1,1,1,1,1]]
// const board = [[1], [1,1],[1,1,1],[1,0,1,1],[1,1,1,1,1]]
const board = [[1], [1,1],[1,1,1],[1,1,1,1],[1,1,0,1,1]]

// console.log(generateBoard())
// console.log(generateBoard2())
console.log(board)

const calculateMoves = (board: number[][]) => {
    const moves: any[] = []
    // Rows
    for(let i = 0; i < board.length; i++) {
        const currentRow = board[i]
        
        // Position
        for(let k = 0; k < currentRow.length; k++) {
            const peg = currentRow[k]
            if (peg === 0) {
                // Empty space, calculate which pieces can jump into this spot
                
                // Check previous row - Complete
                if (i - 2 >= 0) {
                    // const previousRow = board[i-1]
                    // const nextPreviousRow = board[i-2]
                    // const FORWARD_SLANT_PIECE_TO_JUMP = previousRow[k] === 1
                    // const FORWARD_SLANT_PIECE_CAN_JUMP = nextPreviousRow[k] === 1
                    // if (FORWARD_SLANT_PIECE_CAN_JUMP && FORWARD_SLANT_PIECE_TO_JUMP) moves.push({startPosition: { row: i-2, column: k}, endPosition: { row: i, column: k}})

                    // const BACKWARD_SLANT_PIECE_TO_JUMP = previousRow[k-1] === 1
                    // const BACKWARD_SLANT_PIECE_CAN_JUMP = nextPreviousRow[k-2] === 1
                    // if (BACKWARD_SLANT_PIECE_CAN_JUMP && BACKWARD_SLANT_PIECE_TO_JUMP) moves.push({startPosition: { row: i-2, column: k-2}, endPosition: { row: i, column: k}})
                }
                

                // Check current row - Complete (TODO - only need to check this on row 4 & 5)
                // const LEFT_PIECE_TO_JUMP = k-1 >= 0 && currentRow[k-1] === 1
                // const LEFT_PIECE_CAN_JUMP = k-2 >= 0 && currentRow[k-2] === 1
                // if (LEFT_PIECE_TO_JUMP && LEFT_PIECE_CAN_JUMP) moves.push({startPosition: { row: i, column: k-2}, endPosition: { row: i, column: k}})

                // const RIGHT_PIECE_TO_JUMP = k+1 < currentRow.length && currentRow[k+1] === 1
                // const RIGHT_PIECE_CAN_JUMP = k+2 < currentRow.length && currentRow[k+2] === 1
                // if (RIGHT_PIECE_TO_JUMP && RIGHT_PIECE_CAN_JUMP) moves.push({startPosition: { row: i, column: k+2}, endPosition: { row: i, column: k}})

                // Check next row
                // TODO - next spot
            }

        }
    }
    return moves
}

const moves = calculateMoves(board)
const printMoves = moves.map(x => ({startPosition: {row: x.startPosition.row+1, column: x.startPosition.column+1}, endPosition: {row: x.endPosition.row+1, column: x.endPosition.column+1}}))

console.log(printMoves)