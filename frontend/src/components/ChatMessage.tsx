import React from 'react';

interface ChatMessageProps {
    username: string;
    text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ username, text }) => {
    return (
        <tr>
            <td style={{ textAlign: 'left' }}>
                <strong>{username}:</strong> {text}
            </td>
        </tr>
    );
};

export default ChatMessage