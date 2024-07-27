import { ICellValue, IGame, IGameDetail, IGameState, IMove } from "../types";

function getPosition(move: string): number {
  const mapping: { [key: string]: number } = {
    'A1': 0, 'A2': 1, 'A3': 2,
    'B1': 3, 'B2': 4, 'B3': 5,
    'C1': 6, 'C2': 7, 'C3': 8
  };
  return mapping[move];
}
const getStatus = (board: ICellValue[], player: '1' | '2') => {
  // Define winning combinations (rows, columns, diagonals)
  const winningCombinations = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6]  // Diagonal 2
  ];

  // Check for a win
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && (board[a] === board[b]) && (board[a] === board[c])) {
      return null
    }
  }

  // Check for a draw
  if (!board.includes(null)) {
    return null;
  }

  // Return the player whose turn it is based on the passed in player parameter
  return player === '1' ? '2' : '1';
};

const getGameStatesFromMoveList = (gameDetail: IGameDetail): IGameState[] | null => {
  const board: ICellValue[] = Array(9).fill(null);
  const gameStateList: IGameState[] = [];
  gameStateList.push({
    board: [...board],
    move: null,
    turnNumber: 0,
    whoseTurn: '1',
    result: null,
  })
  for (const move of gameDetail.moves) {
    const position = getPosition(move.value);
    const marker = move.player === '1' ? 'X' : 'O';

    if (board[position] !== null) {
      // some kind of problem 
      return null
    }
    board[position] = marker;
    const nextStatus = getStatus(board, move.player)

    gameStateList.push({
      board: [...board],
      move: move.value as IMove,
      turnNumber: move.number,
      whoseTurn: nextStatus,
      result: null,
    });
  }
  return gameStateList;
}

const cellMapping: { [key: number]: string } = {
  0: 'A1',
  1: 'A2',
  2: 'A3',
  3: 'B1',
  4: 'B2',
  5: 'B3',
  6: 'C1',
  7: 'C2',
  8: 'C3',
};

export { getGameStatesFromMoveList, cellMapping }