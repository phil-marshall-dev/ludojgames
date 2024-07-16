import { useParams } from 'react-router-dom';

const GamePage = () => {
  const { id } = useParams();
  return (
    <div className="container text-center mt-5">

  <h1>Game Page for Game ID: {id}</h1>
</div>
);
};

export default GamePage;