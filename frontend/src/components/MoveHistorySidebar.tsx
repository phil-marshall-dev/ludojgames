import React, { useState } from 'react';
import { IGame } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import useGameStore from '../store';

const MoveHistorySidebar: React.FC = () => {
    const displayedMoveIndex = useGameStore((state) => state.displayedMoveIndex)
    const game = useGameStore((state) => state.game)
    const moveToPrevious = useGameStore((state) => state.moveToPrevious)
    const moveToNext = useGameStore((state) => state.moveToNext)
    const setHighlightedMoveIndex= useGameStore((state) => state.setHighlightedMoveIndex)

    const { gameStateList } = game;

    return (
        <div>
            <Button onClick={moveToPrevious} disabled={displayedMoveIndex === 0}>
            <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Button onClick={moveToNext} disabled={displayedMoveIndex === gameStateList.length - 1}>
            <FontAwesomeIcon icon={faChevronRight} />
            </Button>
            <table>
                <thead>
                    <tr>
                        <th>Turn</th>
                        <th>Position</th>
                        {/* Add more columns if needed */}
                    </tr>
                </thead>
                <tbody>
                    {gameStateList.map((state, index) => {
                        if (index > 0) {
                        return (
                            <tr key={index} style={{ backgroundColor: index === displayedMoveIndex ? 'LightGray' : 'transparent' }}>
                                <td>{state.turnNumber}</td>
                                <td onClick={() => setHighlightedMoveIndex(index)}>{state.move}</td>
                                {/* Add more cells if needed */}
                            </tr>
                        )} else {
                            return null
                        }
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MoveHistorySidebar;
