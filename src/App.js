import logo from './logo.svg';
import './App.css';
import Header from './header/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DrawingGame from './drawing_app/drawing_game';
import GridGame from './grid_game/gridGame';
import EmojiGame from './emoji_game/emojiGame';
import Home from './Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drawing-game" element={<DrawingGame />} />
          <Route path="/grid-game" element={<GridGame />} />
          <Route path="/emoji-game" element={<EmojiGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
