import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import GameInfo from '../components/GameInfo';
import ChatBox from '../components/ChatBox';
import Board from '../components/Board';
import MoveHistorySidebar from '../components/MoveHistorySidebar';
import { useLoaderData, useParams } from 'react-router-dom';
import { IGame, IGameDetail } from '../types';

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
  console.log('game')
  console.log(game)
  useEffect(() => {
    if (gameDetail.inProgress) {
      const socket = new WebSocket(`ws://localhost:8000/ws/${gameName}/games/${gameId}/`);

      socket.onopen = () => {
      };

      socket.onclose = () => {
      };


      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { message, type } = data

        if (type === 'existing') {
          setGame({ gameStateList: message});
        } else if (type === 'newState') {
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
      console.log(gameDetail)
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
        <MoveHistorySidebar game={game} />
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
