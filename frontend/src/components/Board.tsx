interface TicTacToeBoardProps {
  board: string[];
  onSquareClick: (index: number) => void;
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ board, onSquareClick }) => {
  const renderSquare = (index: number) => (
    <button className="square" onClick={() => onSquareClick(index)}>
      {board[index]}
    </button>
  );

  return (
    <div className="tic-tac-toe">
      <div className="board">
        {board.map((_, index) => renderSquare(index))}
      </div>
    </div>
  );
};

export default TicTacToeBoard;
