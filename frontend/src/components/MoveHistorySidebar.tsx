import { IGame } from "../types";


const MoveHistorySidebar: React.FC<{ game: IGame }> = ({ game }) => {
    const { gameStateList } = game;
  
    return (
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
            <tr key={index}>
              <td>{state.turn}</td>
              <td>{state.move}</td>
              {/* Add more cells if needed */}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };


export default MoveHistorySidebar