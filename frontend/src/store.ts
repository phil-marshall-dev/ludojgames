import { create } from 'zustand';
import { IGame, IGameState } from './types';
const sortByTurn = (gameStateList: IGameState[]) => {
  return gameStateList.slice().sort((a, b) => a.turn - b.turn);
};
interface GameState {
  game: IGame;
  highlightedMoveIndex: number;
  setGameFromRedisExistingMovesOrConstructedGame: (message: IGameState[]) => void
  setGameFromNewMove: (gameState: IGameState) => void
  moveToPrevious: () => void;
  moveToNext: () => void;
  setHighlightedMoveIndex: (index: number) => void;
  resetGame: () => void;
}

const useGameStore = create<GameState>((set) => ({
  game: { gameStateList: [] },
  highlightedMoveIndex: 0,
  setGameFromRedisExistingMovesOrConstructedGame: (message: IGameState[]) => {
    set({
      game: { gameStateList: sortByTurn(message) },
      highlightedMoveIndex: message.length - 1
    })
  },
  setGameFromNewMove: (gameState: IGameState) => {
    set((state) => {
      const updatedGameStateList = [...state.game.gameStateList, gameState]
      return {
        game: { gameStateList: updatedGameStateList },
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
      game: { gameStateList: [] },
      highlightedMoveIndex: 0,
    })
  }
}))

export default useGameStore;
