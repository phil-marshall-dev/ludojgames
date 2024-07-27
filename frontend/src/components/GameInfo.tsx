import { Card, Row, Col, Button } from 'react-bootstrap';
import { IGameDetail, IGameResult, ISession, IUser } from '../types';
import PlayerTime from './PlayerTime';
import { Link, useOutletContext } from 'react-router-dom';
import useGameStore from '../store';

const GameInfo: React.FC<{ gameDetail: IGameDetail, handleResign: () => void }> = ({ gameDetail, handleResign }) => {
  const session = useOutletContext() as ISession;
  const game = useGameStore((state) => state.game)
  const gameState = game.gameStateList.at(-1)
  const { result } = game
  const { whoseTurn } = gameState || {}

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
  const PlayerCard: React.FC<{ user: IUser; isX: boolean }> = ({ user }) => {
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
                <Link to={`/profile/${user.id}`}>
                  {user.username}
                </Link>
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
    let text;
    if (result) {
      const mapping = {
        '1+': 'Player 1 wins',
        '2+': 'Player 2 wins',
        '1R': 'Player 1 resigns. Player 2 wins',
        '2R': 'Player 2 resigns. Player 1 wins',
        'D': 'Draw',
      }
      text = mapping[result]
    } else {
      if (whoseTurn) {
        const mapping = {
          '1': "Player 1's turn",
          '2': "Player 2's turn",
        }
        text = mapping[whoseTurn]
      }
    }

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
          <PlayerCard user={gameDetail.player_1} isX={true} />
        </Col>
        <Col xs={6} className="d-flex">
          <PlayerCard user={gameDetail.player_2} isX={false} />
        </Col>
        <GameStatus />
        {((session.userId === gameDetail.player_1.id) || (session.userId === gameDetail.player_2.id)) ?
          <Button onClick={handleResign}>Resign</Button> : null}
      </Row>
    </div>
  );
};

export default GameInfo;
