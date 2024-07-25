import { IChallenge, ISession } from "../types";

import { Challenge } from "../components/Challenge";
import { useOutletContext } from "react-router-dom";
import { Table } from "react-bootstrap";

const ChallengesTable: React.FC<{ challenges: IChallenge[], socket: WebSocket | null }> = ({ challenges, socket }) => {
    const session = useOutletContext() as ISession;
    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {challenges.map((challenge) => (
                    <Challenge key={challenge.id} challenge={challenge} session={session} socket={socket} />
                ))}
            </tbody>
        </Table>
    );
};

export default ChallengesTable