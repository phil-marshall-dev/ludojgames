import React, { useState, useEffect, useRef } from 'react';
import { Table, InputGroup, FormControl, Button } from 'react-bootstrap';
import { IChatMessage, ISession, IGameDetail } from '../types';
import { useOutletContext, useParams } from 'react-router-dom';
import ChatMessage from './ChatMessage'

interface ChatBoxProps {
  gameDetail: IGameDetail;
}

const ChatBox: React.FC<ChatBoxProps> = ({gameDetail}) => {
  const { gameName, gameId } = useParams();
  const session = useOutletContext() as ISession;
  const [chats, setChats] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLTableRowElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const sortedChats = [...chats].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${gameName}/games/${gameId}/chat/`);
    setWs(socket);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { message, type } = data
        if (type === 'existing') {
          setChats(message);
        } else if (type === 'created') {
          setChats((prevChallenges) => [...prevChallenges, message]);
        }
    };

    socket.onclose = () => {
    };

    return () => {
      socket.close();
    };
}, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      ws?.send(JSON.stringify({ action: 'create', payload: input }));
      setInput('');
    }


  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc' }}>
        <Table borderless>
          <tbody>
            {sortedChats.map((chat, index) => (
              <ChatMessage key={index} username={chat.author.username} text={chat.text} />
            ))}
            <tr ref={messagesEndRef} />
          </tbody>
        </Table>
      </div>
      {((session.userId === gameDetail.player_1.id) || (session.userId === gameDetail.player_2.id)) ? (
        <InputGroup className="mt-3">
          <FormControl
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button variant="primary" onClick={handleSendMessage}>Send</Button>

        </InputGroup>) : null}
    </div>
  );
};

export default ChatBox;
