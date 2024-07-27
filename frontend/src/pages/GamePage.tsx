import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import GameInfo from '../components/GameInfo';
import ChatBox from '../components/ChatBox';
import Board from '../components/Board';
import MoveHistorySidebar from '../components/MoveHistorySidebar';
import { useLoaderData, useParams } from 'react-router-dom';
import { IGameDetail, } from '../types';
import useGameStore from '../store';
import { getGameStatesFromMoveList, cellMapping } from '../gameLogic/tictactoe'
const pageStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  textAlign: 'center',
  width: '100%',
}


const GamePage = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const gameDetail = useLoaderData() as IGameDetail;
  const { gameName, gameId } = useParams();
  const resetGame = useGameStore((state) => state.resetGame);
  const setGameFromRedisExistingMovesOrConstructedGame = useGameStore((state => state.setGameFromRedisExistingMovesOrConstructedGame))
  const setGameFromNewMove = useGameStore((state) => state.setGameFromNewMove)
  const setGameResigned = useGameStore((state) => state.setGameResigned)

  useEffect(() => {
    if (gameDetail.inProgress) {
      const socket = new WebSocket(`ws://localhost:8000/ws/${gameName}/games/${gameId}/`);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { message, type } = data;
        if (type === 'existing') {
          console.log('got existing')
          console.log(message)
            setGameFromRedisExistingMovesOrConstructedGame(message)
        } else if (type === 'newState') {
            setGameFromNewMove(message)
        } else if (type === 'resignation') {
          setGameResigned(message)
        }
    };


      setWs(socket);

      return () => {
        socket.close();
        resetGame();
      };
    } else {
      const constructedGame = getGameStatesFromMoveList(gameDetail)
      if (constructedGame) {
        setGameFromRedisExistingMovesOrConstructedGame(constructedGame)
      }
      return () => {
        resetGame();
      };
    }
  }, [gameDetail.inProgress, gameName, gameId,]);

  const handleCellClick = (index: number) => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'move', payload: cellMapping[index] }));
    }
  };

  const handleResign = () => {
    console.log(
      'resigining'
    )
    if (ws) {
      ws.send(JSON.stringify({ action: 'resign' }));
    }
  };

  return (
    <Row className="align-items-center" style={pageStyle}>
      <Col md={3} xs={12}>
        <MoveHistorySidebar />
      </Col>
      <Col md={6} xs={12} style={{ display: 'flex', height: '100%' }}>
        <Board gameDetail={gameDetail} handleCellClick={handleCellClick} />
      </Col>
      <Col md={3} xs={12} className="text-center ms-auto">
        <GameInfo gameDetail={gameDetail} handleResign={handleResign} />
        <ChatBox gameDetail={gameDetail} />
      </Col>
    </Row>
  );
};

export default GamePage;
