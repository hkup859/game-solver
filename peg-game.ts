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

const startingBoard: BOARD = [[0], [1,1],[1,1,1],[1,1,1,1],[1,1,1,1,1]]
// const startingBoard = [[1], [1,1],[1,1,1],[1,1,0,1],[1,1,1,1,1]]
// const startingBoard = [[1], [1,1],[1,1,1],[1,0,1,1],[1,1,1,1,1]]
// const startingBoard = [[1], [1,1],[1,1,1],[1,1,1,1],[1,1,0,1,1]]
// const startingBoard = [[1], [1,1],[1,0,1],[1,1,0,1],[1,1,1,1,1]]

// console.log(generateBoard())
// console.log(generateBoard2())
// console.log(startingBoard)

type POSITION = { row: number, column: number }
type MOVE = {
    startPosition: POSITION,
    endPosition: POSITION
}
type BOARD = number[][]
type GAME_STATE = {board: BOARD, lastMove: MOVE, complete: boolean, moves: MOVE[], id: string, parentId?: string, score: number}
type GAME = {startingBoard: BOARD, gameStates: GAME_STATE[],}


const calculateMoves = (board: BOARD): MOVE[] => {
    const moves: MOVE[] = []
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
                    const previousRow = board[i-1]
                    const nextPreviousRow = board[i-2]
                    const FORWARD_SLANT_PIECE_TO_JUMP = previousRow[k] === 1
                    const FORWARD_SLANT_PIECE_CAN_JUMP = nextPreviousRow[k] === 1
                    if (FORWARD_SLANT_PIECE_CAN_JUMP && FORWARD_SLANT_PIECE_TO_JUMP) moves.push({startPosition: { row: i-2, column: k}, endPosition: { row: i, column: k}})

                    const BACKWARD_SLANT_PIECE_TO_JUMP = previousRow[k-1] === 1
                    const BACKWARD_SLANT_PIECE_CAN_JUMP = nextPreviousRow[k-2] === 1
                    if (BACKWARD_SLANT_PIECE_CAN_JUMP && BACKWARD_SLANT_PIECE_TO_JUMP) moves.push({startPosition: { row: i-2, column: k-2}, endPosition: { row: i, column: k}})
                }
                

                // Check current row - Complete (TODO - only need to check this on row 4 & 5)
                const LEFT_PIECE_TO_JUMP = k-1 >= 0 && currentRow[k-1] === 1
                const LEFT_PIECE_CAN_JUMP = k-2 >= 0 && currentRow[k-2] === 1
                if (LEFT_PIECE_TO_JUMP && LEFT_PIECE_CAN_JUMP) moves.push({startPosition: { row: i, column: k-2}, endPosition: { row: i, column: k}})

                const RIGHT_PIECE_TO_JUMP = k+1 < currentRow.length && currentRow[k+1] === 1
                const RIGHT_PIECE_CAN_JUMP = k+2 < currentRow.length && currentRow[k+2] === 1
                if (RIGHT_PIECE_TO_JUMP && RIGHT_PIECE_CAN_JUMP) moves.push({startPosition: { row: i, column: k+2}, endPosition: { row: i, column: k}})

                // Check next row
                if (i + 2 < board.length) {
                    const nextRow = board[i+1]
                    const secondRow = board[i+2]
                    const FORWARD_SLANT_PIECE_TO_JUMP = nextRow[k] === 1
                    const FORWARD_SLANT_PIECE_CAN_JUMP = secondRow[k] === 1
                    if (FORWARD_SLANT_PIECE_CAN_JUMP && FORWARD_SLANT_PIECE_TO_JUMP) moves.push({startPosition: { row: i+2, column: k}, endPosition: { row: i, column: k}})

                    const BACKWARD_SLANT_PIECE_TO_JUMP = nextRow[k+1] === 1
                    const BACKWARD_SLANT_PIECE_CAN_JUMP = secondRow[k+2] === 1
                    if (BACKWARD_SLANT_PIECE_CAN_JUMP && BACKWARD_SLANT_PIECE_TO_JUMP) moves.push({startPosition: { row: i+2, column: k+2}, endPosition: { row: i, column: k}})
                }
            }

        }
    }
    return moves
}

const printMoves = (moves: MOVE[]) => {
    return moves.map(x => ({startPosition: {row: x.startPosition.row+1, column: x.startPosition.column+1}, endPosition: {row: x.endPosition.row+1, column: x.endPosition.column+1}}))
}

const countPieces = (board: BOARD) => {
    return board.flat(2).filter(x => x === 1).length
}

const processMove = (move: MOVE, board: BOARD): BOARD => {
    // {startPosition: {row: 0, column: 0}, endPosition: {row: 0, column: 2}}
    // [[1],[1,1],[0,0,1],[1,1,0,1],[1,1,1,1,1]]
    // Calculate piece jumped
    const rowDiff = move.startPosition.row - move.endPosition.row // 0
    const columnDiff = move.startPosition.column - move.endPosition.column // -2
    const missingRowPosition = rowDiff === 2 ? move.startPosition.row-1 : (rowDiff === -2 ? move.startPosition.row+1 : move.startPosition.row) // TODO - can this be re-worked to be more clear
    const missingColumnPosition = columnDiff === 2 ? move.startPosition.column-1 : (columnDiff === -2 ? move.startPosition.column+1 : move.startPosition.column) // TODO - can this be re-worked to be more clear
    
    // missingRowPosition = 0
    // missingColumnPosition = 0+1->1
    // Remove jumped piece
    board[missingRowPosition][missingColumnPosition] = 0

    // Remove jumping piece
    board[move.startPosition.row][move.startPosition.column] = 0

    // Add jumping piece to end position
    board[move.endPosition.row][move.endPosition.column] = 1

    return board

}

const processMoves = (moves: MOVE[], board: BOARD): GAME_STATE[] => {
    const newGameStates: GAME_STATE[] = []
    for(let i = 0; i < moves.length; i++) {
        const currentMove = moves[i]
        const newBoard = processMove(currentMove, JSON.parse(JSON.stringify(board)))
        const nextMoves = calculateMoves(newBoard)
        newGameStates.push({board: newBoard, lastMove: currentMove, moves: nextMoves, complete: nextMoves.length === 0, id: crypto.randomUUID(), score: countPieces(newBoard)})
    }
    return newGameStates
}

// const processGameRound = (board: BOARD, moveHistory: {board: BOARD, move: MOVE}[] = [])  => {
//     const newMoves = calculateMoves(board)
//     const newGameStates = processMoves(newMoves, board)
//     let completedGames: {moveHistory: MOVE[], score: number}[] = []
//     for(let i = 0; i < newGameStates.length; i++) {
//         const currentGameState = newGameStates[i]
        
//         // Record chosen move
//         moveHistory.push({board: JSON.parse(JSON.stringify(board)), move: currentGameState.lastMove})

//         // If game is not complete, continue processing next round
//         if (!currentGameState.complete) {
//             const nextRoundResults: {moveHistory: MOVE[], score: number}[] = processGameRound(JSON.parse(JSON.stringify(currentGameState.board)), JSON.parse(JSON.stringify(moveHistory)))
//             completedGames = completedGames.concat(nextRoundResults)
//         }
//         else {
//             console.log("COMPLETE")
//             completedGames.push({moveHistory: JSON.parse(JSON.stringify(moveHistory)), score: countPieces(currentGameState.board)})
//         }
//     }
//     return completedGames
// }

const processGameRound = (board: BOARD, moves: MOVE[])  => {
    const newGameStates = processMoves(moves, board)
    return newGameStates
}

const compressMove = (move: MOVE) => {
    return `${move.startPosition.row+1}-${move.startPosition.column+1}->${move.endPosition.row+1}-${move.endPosition.column+1}`
}

const uncompressMove = (compressedMove: string): MOVE => {
    const datas = compressedMove.split('-')
    return {
        startPosition: {
            row: Number(datas[0])-1,
            column: Number(datas[1])-1,
        },
        endPosition: {
            row: Number(datas[2].substring(1))-1,
            column: Number(datas[3])-1,
        }
    }
}

const compressGameState = (gameState: GAME_STATE) => {
    return `${gameState.id}|${gameState.parentId}|${compressMove(gameState.lastMove)}|${gameState.complete}|${gameState.board.join('*')}|${gameState.moves.map(x => compressMove(x))}|${gameState.score}\n`
}

const saveData = (data: GAME_STATE[], filename: string, overwrite: boolean) => {
    if (overwrite) {
        try {
            Deno.removeSync(`${filename}.txt`, {recursive: true})
        }
        catch(err) {
            console.log("File Error: ", err)
        }
    }
    for(let i = 0; i < data.length; i++) {
        if (i % (Math.round(data.length/10)) === 0) {
            console.log("Compression Progress: ", (i/data.length).toFixed(2), new Date())
        }
        Deno.writeTextFileSync(`${filename}.txt`, compressGameState(data[i]), {append: true})
    }
}

const loadData = (completeData = false): GAME_STATE[] => {
    const filename = completeData ? 'compressedData_complete.txt' : 'compressedResults_next.txt'
    const lines = Deno.readTextFileSync(filename).split('\n').filter(x => x !== '')
    
    console.log("FILE ACCESSED")

    return lines.map(x => {
        const datas = x.split('|')
        return {
            id: datas[0],
            parentId: datas[1] !== 'undefined' ? datas[1] : undefined,
            lastMove: uncompressMove(datas[2]),
            complete: datas[3] === "true",
            board: datas[4].split('*').map(y => y.split(',').map(z => Number(z))),
            moves: datas[5] !== '' ? datas[5].split(',').map(y => uncompressMove(y)) : [],
            score: Number(datas[6])
        }
    })
}

const reconstructGameHistory = (id: string, gameStates: GAME_STATE[]): GAME_STATE[] => {
    let currentRound = gameStates.find(x => x.id === id)
    if (!currentRound) throw Error("NO ROUND FOUND")
    
    if (currentRound?.parentId) {
        return [currentRound, ...reconstructGameHistory(currentRound.parentId, gameStates)]
    } else {
        return [currentRound]
    }
}

// const results = processGameRound(JSON.parse(JSON.stringify(startingBoard)))
// console.log("THE END 1: ", results)




// console.log(previousResults)

// Initialize Variables
let previousResults: GAME_STATE[]
let completeGame = false
let count = 0
let reconstruct = true

// Redo to make it ONLY read from file
while (!completeGame && count < 1) {
    // if(count === 0) {
    //     // Load from scratch
    //     const theBoard = JSON.parse(JSON.stringify(startingBoard))
    //      previousResults = processGameRound(theBoard, calculateMoves(theBoard))
    // } else {
        // Load from save state (file)
        previousResults = await loadData(reconstruct)
        console.log("GOT DATA FORMATED")
    // }

    if (reconstruct) {
        console.log("reconstructGameHistory: ", reconstructGameHistory('cee37b87-f49b-4500-adda-30f2180b6c76', previousResults).map(x=> compressMove(x.lastMove)))
    } else {
        console.log("WHILE: ", count, previousResults.length)
        let nextResults: GAME_STATE[] = []
        saveData(previousResults, 'compressedData_complete', false)
        for(let i = 0; i < previousResults.length; i++) {
            
            // For each resulting game state
            
            // If not complete, keep going
            // if (previousResults[i].complete) {
            //     console.log("COMPLETED")
            // }
            if (!previousResults[i].complete) {
                if(i % (Math.round(previousResults.length/100)) === 0) console.log("Progress: ", (i/previousResults.length).toFixed(3), new Date())
                const newGameState = JSON.parse(JSON.stringify(previousResults[i]))
                const roundResult = processGameRound(newGameState.board, newGameState.moves)
                
                // // Remove from previous results
                // previousResults = previousResults.filter(x => x.id !== previousResults[i].id)
        
                // Insert new iterations
                nextResults = nextResults.concat(roundResult.map(x => ({...x, parentId: previousResults[i].id})))
            }
        }
        saveData(nextResults, 'compressedResults_next', true)
        
            
        previousResults = nextResults
    }
    
    count++
}
console.log("THE END")



console.log("THE END 2")
