import { create } from 'zustand';
import { IGame, IGameResult, IGameState } from './types';
const sortByTurn = (gameStateList: IGameState[]) => {
  return gameStateList.slice().sort((a, b) => a.turnNumber - b.turnNumber);
};

interface GameState {
  game: IGame;
  displayedMoveIndex: number;
  setGameFromRedisExistingMovesOrConstructedGame: (message: IGame) => void;
  setGameFromNewMove: (params: { gameState: IGameState; result: IGameResult }) => void;
  moveToPrevious: () => void;
  moveToNext: () => void;
  setHighlightedMoveIndex: (index: number) => void;
  resetGame: () => void;
  setGameResigned: (resigningPlayer: '1R' | '2R') => void;
}

const useGameStore = create<GameState>((set) => ({
  game: { gameStateList: [], result: null },
  displayedMoveIndex: 0,
  setGameFromRedisExistingMovesOrConstructedGame: (message: IGame) => {
    set({
      game: {
        gameStateList: sortByTurn(message.gameStateList),
        result: message.result
      },
      displayedMoveIndex: message.gameStateList.length - 1
    })
  },
  setGameFromNewMove: ({gameState, result}) => {
    set((state) => {
      const updatedGameStateList = sortByTurn([...state.game.gameStateList, gameState])
      return {
        game: { gameStateList: updatedGameStateList, result },
        displayedMoveIndex: updatedGameStateList.length - 1,
      }
    })
  },
  moveToPrevious: () => {
    set((state) => {
      if (state.displayedMoveIndex > 0) {
        return {
          displayedMoveIndex: state.displayedMoveIndex - 1
        }
      } else {
        return {}
      }
    })
  },
  moveToNext: () => {
    set((state) => {
      if (state.displayedMoveIndex < state.game.gameStateList.length - 1) {
        return {
          displayedMoveIndex: state.displayedMoveIndex + 1
        }
      } else {
        return {}
      }
    })
  },
  setHighlightedMoveIndex: (index: number) => {
    set((state) => {
      const { length } = state.game.gameStateList
      if (index >= 0 && index < length) {

        return { displayedMoveIndex: index }
      } else {
        return {}
      }

    })
  },
  resetGame: () => {
    set({
      game: { gameStateList: [], result: null },
      displayedMoveIndex: 0,
    })
  },
  setGameResigned: (resigningPlayer) => {
    set((state) => {
      return {
        game: {
          gameStateList: state.game.gameStateList,
          result: resigningPlayer
        }
      }
    })
  }
}))

export default useGameStore;
