import React from 'react';
import { IChallenge, ISession } from '../types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';



export const Challenge: React.FC<{ challenge: IChallenge, session: ISession | null, socket: WebSocket | null }> = ({ challenge, session, socket }) => {
    const handleAccept = async () => {
        socket?.send(JSON.stringify({ action: 'accept', payload: {id: challenge.id }}));
    };

    const handleDelete = async () => {
        socket?.send(JSON.stringify({ action: 'delete', payload: {id: challenge.id }}));
    }; 
    console.log('session', session)

    return (
        <tr>
            <td className="align-middle">
                <Link to={`/profile/${challenge.userId}`} style={{ textDecoration: 'none' }}>
                    {challenge.username}
                </Link>
            </td>
            <td className="align-middle">{new Date(challenge.createdAt).toLocaleString()}</td>
            <td className="align-middle">
                {session?.isAuthenticated && (
                    challenge.userId === session.userId ? (
                        <Button variant="danger" size="sm" onClick={handleDelete}>
                            Delete
                        </Button>
                    ) : (
                        <Button variant="primary" size="sm" onClick={handleAccept}>
                            Accept
                        </Button>
                    )
                )}
            </td>
        </tr>
    );};

