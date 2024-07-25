import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import GameInfo from '../components/GameInfo';
import ChatBox from '../components/ChatBox';
import Board from '../components/Board';
import MoveHistorySidebar from '../components/MoveHistorySidebar';
import { useLoaderData, useParams } from 'react-router-dom';
import { ICellValue, IGame, IGameDetail, IGameDetailMove } from '../types';


function getPosition(move: string): number {
  const mapping: { [key: string]: number } = {
    'A1': 0, 'A2': 1, 'A3': 2,
    'B1': 3, 'B2': 4, 'B3': 5,
    'C1': 6, 'C2': 7, 'C3': 8
  };
  return mapping[move];
}

const getGameStateFromMoveList = (moves: IGameDetailMove[]): IGame | null => {

  const game: IGame = { gameStateList: [] }
  const board: ICellValue[] = Array(9).fill(null);


  game.gameStateList.push({
    board,
    move: null,
    turn: 0,
    status: '1'
  })

  for (const move of moves) {
    const position = getPosition(move.value);
    const marker = move.player === '1' ? 'X' : 'O';

    if (board[position] !== null) {
      return null
    }

    board[position] = marker;
    game.gameStateList.push({
      board: [...board],
      move: null,
      turn: move.number,
      status: '1'
    });
  }

  return game;

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

const GamePage = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const gameDetail = useLoaderData() as IGameDetail;
  const { gameName, gameId } = useParams();
  const [game, setGame] = useState<IGame>({ gameStateList: [] });
  const [highlightedMoveIndex, setHighlightedMoveIndex] = useState<number>(game.gameStateList.length - 1);

  useEffect(() => {
    if (gameDetail.inProgress) {
      const socket = new WebSocket(`ws://localhost:8000/ws/${gameName}/games/${gameId}/`);

      socket.onopen = () => {
      };

      socket.onclose = () => {
      };


      socket.onmessage = (event) => {
        console.log('recieving message')
        const data = JSON.parse(event.data);
        const { message, type } = data
        console.log( { message, type })

        if (type === 'existing') {
          console.log('setting from exising')
          setGame({ gameStateList: message });
        } else if (type === 'newState') {
          console.log('setting from new move')

          setGame(prevGame => {
            return { gameStateList: [...prevGame.gameStateList, message] }
          })
        }
      };


      setWs(socket);

      return () => {
        socket.close();
      };
    } else {
      console.log('not in progress so using api results')
      const constructedGame = getGameStateFromMoveList(gameDetail.moves)
      if (constructedGame) {
        console.log(
          'setting constructed game from moves'
        )
        setGame(constructedGame)
      }
    }
  }, [gameDetail.inProgress, gameName, gameId]);

  const handleCellClick = (index: number) => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'move', payload: cellMapping[index] }));
    }
  };

  return (
    <Row className="align-items-center" style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      textAlign: 'center',
      width: '100%',
    }}>
      <Col md={3} xs={12}>
        <MoveHistorySidebar game={game} highlightedMoveIndex={highlightedMoveIndex} setHighlightedMoveIndex={setHighlightedMoveIndex}/>
      </Col>
      <Col md={6} xs={12} style={{ display: 'flex', height: '100%' }}>
        <Board gameDetail={gameDetail} game={game} handleCellClick={handleCellClick} />
      </Col>
      <Col md={3} xs={12} className="text-center ms-auto">
        <GameInfo gameDetail={gameDetail} gameState={game.gameStateList.at(-1)} />
        <ChatBox gameDetail={gameDetail} />
      </Col>
    </Row>
  );
};

export default GamePage;
