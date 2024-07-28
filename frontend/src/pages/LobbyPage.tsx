import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IChallenge, ISession } from "../types";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import ChallengesTable from "../components/ChallengesTable";

const LobbyPage: React.FC = () => {
    const { gameName } = useParams();
    const navigate = useNavigate()
    const session = useOutletContext() as ISession;
    const [challenges, setChallenges] = useState<IChallenge[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const hasChallenge = challenges.some(challenge => challenge.userId === session.userId);
    useEffect(() => {
        const newSocket = new WebSocket(`ws://localhost:8000/ws/${gameName}/lobby/`);
        setSocket(newSocket);

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const { message, type } = data
            if (type === 'existing') {
                setChallenges(message);
            } else if (type === 'created') {
                setChallenges((prevChallenges) => [...prevChallenges, message]);
            } else if (type === 'deleted') {
                setChallenges((prevChallenges) =>
                    prevChallenges.filter((challenge) => challenge.id !== message.id)
                );
            } else if (type === 'accepted') {
                setChallenges((prevChallenges) =>
                    prevChallenges.filter((challenge) => challenge.id !== data.message.id)
                );
                if (message.playerIds.includes(session.userId)) {
                    navigate(`/${gameName}/games/${message.gameId}`)
                }
            }
        };

        newSocket.onclose = () => {
        };

        return () => {
            newSocket.close();
        };
    }, []);

    const createChallenge = () => {
        socket?.send(JSON.stringify({ action: 'create' }));
    };

    return (<Row className="justify-content-md-center mt-3">
        <Col md={6} xs={12}>
            <div>
                <h2>Existing Challenges</h2>
                {session.userId ?
                    (hasChallenge ?
                        "Waiting for opponent..."
                        : <Button onClick={createChallenge}>Create Challenge</Button>)
                    : null}
                <ChallengesTable challenges={challenges} socket={socket} />
            </div>
            <div>
                <Button>Play vs the computer</Button>
            </div>
        </Col>
    </Row>
    );
};

export default LobbyPage;