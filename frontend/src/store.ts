import { create } from 'zustand';
import { IGame, IGameState } from './types';
const sortByTurn = (gameStateList: IGameState[]) => {
  console.log('state list is')
  console.log(gameStateList)
  return gameStateList.slice().sort((a, b) => a.turnNumber - b.turnNumber);
};

interface GameState {
  game: IGame;
  highlightedMoveIndex: number;
  setGameFromRedisExistingMovesOrConstructedGame: (message: IGameState[]) => void;
  setGameFromNewMove: (gameState: IGameState) => void;
  moveToPrevious: () => void;
  moveToNext: () => void;
  setHighlightedMoveIndex: (index: number) => void;
  resetGame: () => void;
  setGameResigned: (resigningPlayer: '1R' | '2R') => void;
}

const useGameStore = create<GameState>((set) => ({
  game: { gameStateList: [], result: null },
  highlightedMoveIndex: 0,
  setGameFromRedisExistingMovesOrConstructedGame: (message: IGameState[]) => {
    const lastGameState = message.at(-1)
    const result = lastGameState ? lastGameState.result : null
    set({
      game: { gameStateList: sortByTurn(message), result },
      highlightedMoveIndex: message.length - 1
    })
  },
  setGameFromNewMove: (gameState: IGameState) => {
    set((state) => {
      const updatedGameStateList = [...state.game.gameStateList, gameState]
      return {
        game: { gameStateList: updatedGameStateList, result: gameState.result },
        highlightedMoveIndex: updatedGameStateList.length - 1,
      }
    })
  },
  moveToPrevious: () => {
    set((state) => {
      if (state.highlightedMoveIndex > 0) {
        return {
          highlightedMoveIndex: state.highlightedMoveIndex - 1
        }
      } else {
        return {}
      }
    })
  },
  moveToNext: () => {
    set((state) => {
      if (state.highlightedMoveIndex < state.game.gameStateList.length - 1) {
        return {
          highlightedMoveIndex: state.highlightedMoveIndex + 1
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

        return { highlightedMoveIndex: index }
      } else {
        return {}
      }

    })
  },
  resetGame: () => {
    set({
      game: { gameStateList: [], result: null },
      highlightedMoveIndex: 0,
    })
  },
  setGameResigned: (resigningPlayer) => {

  }
}))

export default useGameStore;
