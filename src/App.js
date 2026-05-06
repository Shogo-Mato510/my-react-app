import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Favorites from './pages/Favorites';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
