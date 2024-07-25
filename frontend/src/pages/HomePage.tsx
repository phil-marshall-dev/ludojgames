import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ISession } from '../types';

const GameLobbies = () => {
  const session = useOutletContext() as ISession;

  return (
    <div>
      <h1>Games</h1>
      <ul>
      <li>
          <Link to="/tic-tac-toe/lobby" >
            Tic-Tac-Toe
          </Link>
        </li>
        <li>
          <Link to="/ultimate-ttt/lobby" >
            Ultimate tic-tac-toe
          </Link>
        </li>
        <li>
          <Link to="/bizingo/lobby">
            Bizingo Lobby
          </Link>
        </li>
        <li>
          <Link to="/qubic/lobby">
            Qubic Lobby
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default GameLobbies;
