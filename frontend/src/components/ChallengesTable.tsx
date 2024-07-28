import { IChallenge, ISession } from "../types";

import { Challenge } from "../components/Challenge";
import { useOutletContext } from "react-router-dom";
import { Table } from "react-bootstrap";

const ChallengesTable: React.FC<{ challenges: IChallenge[], socket: WebSocket | null }> = ({ challenges, socket }) => {
    const session = useOutletContext() as ISession;
    if (challenges.length) {
        return (
            <Table striped bordered hover size="sm">
                <tbody>
                    {challenges.map((challenge) => (
                        <Challenge key={challenge.id} challenge={challenge} session={session} socket={socket} />
                    ))}
                </tbody>
            </Table>
        );
    } else {
        return (
            <div>
                No challenges exist at this time.
            </div>
        )
    }
};

export default ChallengesTable