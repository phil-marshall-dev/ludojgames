import React from 'react';
import { IGameDetail } from '../types';
import useGameStore from '../store';

interface BoardProps {
  gameDetail: IGameDetail;
  handleCellClick: (index: number) => void;
}

const Board: React.FC<BoardProps> = ({ gameDetail, handleCellClick }) => {
  const game = useGameStore((state) => state.game)
  const displayedMoveIndex = useGameStore((state) => state.displayedMoveIndex)
  const board = game.gameStateList.at(displayedMoveIndex)?.board
  const cellSize = 100;  // Use larger units for cell size
  const boardSize = cellSize * 3;  // 3x3 grid
  const radius = cellSize / 4;     // Radius for the circle representing 'O'
  const strokeWidth = 8;           // Stroke width for both 'O' and 'X'
  
  // Function to get the position of the center of a cell
  const getCellCenter = (index: number) => {
    const x = (index % 3) * cellSize;
    const y = Math.floor(index / 3) * cellSize;
    return { x, y };
  };


  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${boardSize} ${boardSize}`} preserveAspectRatio="xMidYMid meet">
      {/* Draw the grid lines */}
      <line x1={cellSize} y1={0} x2={cellSize} y2={boardSize} stroke="black" strokeWidth={strokeWidth} />
      <line x1={cellSize * 2} y1={0} x2={cellSize * 2} y2={boardSize} stroke="black" strokeWidth={strokeWidth} />
      <line x1={0} y1={cellSize} x2={boardSize} y2={cellSize} stroke="black" strokeWidth={strokeWidth} />
      <line x1={0} y1={cellSize * 2} x2={boardSize} y2={cellSize * 2} stroke="black" strokeWidth={strokeWidth} />

      {/* Draw the Xs and Os and the clickable areas */}
      {board?.map((cell, index) => {
        const { x, y } = getCellCenter(index);

        return (
          <React.Fragment key={index}>
            {/* Clickable area */}
            <rect
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              fill="transparent"
              onClick={() => handleCellClick(index)}
            />
            {cell === 'O' && (
              <circle
                cx={x + cellSize / 2}
                cy={y + cellSize / 2}
                r={radius}
                stroke="blue"
                strokeWidth={strokeWidth}
                fill="none"
              />
            )}
            {cell === 'X' && (
              <>
                <line
                  x1={x + cellSize / 2 - radius}
                  y1={y + cellSize / 2 - radius}
                  x2={x + cellSize / 2 + radius}
                  y2={y + cellSize / 2 + radius}
                  stroke="red"
                  strokeWidth={strokeWidth}
                />
                <line
                  x1={x + cellSize / 2 + radius}
                  y1={y + cellSize / 2 - radius}
                  x2={x + cellSize / 2 - radius}
                  y2={y + cellSize / 2 + radius}
                  stroke="red"
                  strokeWidth={strokeWidth}
                />
              </>
            )}
          </React.Fragment>
        );
      })}
    </svg>
  );
};

export default Board;
