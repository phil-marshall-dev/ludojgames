import React, { useState } from 'react';
import { IGame } from "../types";

interface MoveHistorySidebarProps {
  game: IGame
  highlightedMoveIndex: number;
  setHighlightedMoveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MoveHistorySidebar: React.FC<MoveHistorySidebarProps> = ({ game, highlightedMoveIndex, setHighlightedMoveIndex }) => {
    const { gameStateList } = game;

    const goToPreviousMove = () => {
      if (highlightedMoveIndex > 0) {
          setHighlightedMoveIndex(highlightedMoveIndex - 1);
      }
  };

  const goToNextMove = () => {
      if (highlightedMoveIndex < game.gameStateList.length - 1) {
          setHighlightedMoveIndex(highlightedMoveIndex + 1);
      }
  };
    return (
        <div>
            <button onClick={goToPreviousMove} disabled={highlightedMoveIndex === 0}>
                Previous
            </button>
            <button onClick={goToNextMove} disabled={highlightedMoveIndex === gameStateList.length - 1}>
                Next
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Turn</th>
                        <th>Position</th>
                        {/* Add more columns if needed */}
                    </tr>
                </thead>
                <tbody>
                    {gameStateList.map((state, index) => (
                        <tr key={index} style={{ backgroundColor: index === highlightedMoveIndex ? 'yellow' : 'transparent' }}>
                            <td>{state.turn}</td>
                            <td>{state.move}</td>
                            {/* Add more cells if needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MoveHistorySidebar;
