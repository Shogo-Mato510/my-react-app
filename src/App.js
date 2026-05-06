import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
