import React from 'react';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap'; // Import Table component
import { IProfileDetail } from '../types';

const ProfilePage = () => {
    const { user, recentGames } = useLoaderData() as IProfileDetail

    return (
        <div className="container text-center mt-5">            
            <div className="mt-4">
                <h2>{user.username}'s Recent Games</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Game ID</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentGames.map(game => (
                            <tr key={game.id}>
                                <td><Link to={`/tic-tac-toe/games/${game.id}`}>{game.id}</Link></td>
                                <td>{game.player_1.username}</td>
                                <td>{game.player_2.username}</td>
                                <td>{game.result}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default ProfilePage;
