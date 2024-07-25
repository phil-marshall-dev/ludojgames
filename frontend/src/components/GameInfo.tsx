import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { IGameDetail, IGameState, IGameStatus } from '../types';
import PlayerTime from './PlayerTime';

const GameInfo: React.FC<{ gameDetail: IGameDetail, gameState: IGameState | undefined }> = ({ gameDetail, gameState }) => {
  const { status } = gameState || {}

  const gameStatusDescriptions: Record<IGameStatus, string> = {
    '1': 'Player 1 to move',
    '2': 'Player 2 to move',
    '1+': 'Player 1 wins',
    '2+': 'Player 2 wins',
    'D': 'Draw',
  };


  const avatarStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
  };

  const cardBodyStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
  };

  const noPaddingStyle: React.CSSProperties = {
    paddingRight: 0,
    paddingLeft: 0,
  };
  const PlayerCard: React.FC<{ username: string; isX: boolean }> = ({ username }) => {
    const moveStartTimeStamp = Date.now()
    const timeOnClockAtStartOfMove = 5 * 60 * 1000;
    return (
      <Card className="position-relative h-100">
        <Card.Body style={cardBodyStyle} className="d-flex">
          <Row className="flex-grow-1 w-100">
            <Col xs={4} className="d-flex align-items-center" style={noPaddingStyle}>
              <img src='/default-avatar.png' alt="Avatar" style={avatarStyle} />
            </Col>
            <Col xs={8} className="d-flex flex-column justify-content-center" style={{ position: 'relative' }}>
              <Card.Title className="h5 h-md6" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {username}
              </Card.Title>
              <Card.Subtitle className="text-muted h6">
                <PlayerTime moveStartTimeStamp={moveStartTimeStamp} timeOnClockAtStartOfMove={timeOnClockAtStartOfMove} playersTurn={false} />
              </Card.Subtitle>
              <Card.Text className="small">Elo: 3000</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }

  const GameStatus: React.FC = () => {
    const text = status ? gameStatusDescriptions[status] : 'An error occured'

    return (
      <div>
        {text}
      </div>
    )
  }

  return (
    <div className="text-center">
      <Row className="mb-3">
        <Col xs={6} className="d-flex">
          <PlayerCard username={gameDetail.player_1.username} isX={true} />
        </Col>
        <Col xs={6} className="d-flex">
          <PlayerCard username={gameDetail.player_2.username} isX={false} />
        </Col>
        <GameStatus />
      </Row>
    </div>
  );
};

export default GameInfo;
