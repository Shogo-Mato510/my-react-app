import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Favorites from './pages/Favorites';
import {
  addFavoriteQuote,
  getFavoriteQuotes,
  isFavoriteQuote,
  removeFavoriteQuote,
  setFavoriteQuotes,
} from './favoritesStorage';

const THEME_STORAGE_KEY = 'themeMode';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    setFavorites(getFavoriteQuotes());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    setFavoriteQuotes(favorites);
  }, [favorites]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleAddFavorite = (quote) => {
    setFavorites((prev) => addFavoriteQuote(quote, prev));
  };

  const handleRemoveFavorite = (quote) => {
    setFavorites((prev) => removeFavoriteQuote(quote, prev));
  };

  const isFavorite = (quote) => isFavoriteQuote(quote, favorites);

  return (
    <BrowserRouter>
      <div className={isDarkMode ? 'theme-dark' : ''}>
        <Navbar
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          favoriteCount={favorites.length}
        />
        <div className="app-shell">
          <Routes>
            <Route
              path="/"
              element={<Home isFavorite={isFavorite} addFavorite={handleAddFavorite} />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/favorites"
              element={
                <Favorites favorites={favorites} removeFavorite={handleRemoveFavorite} />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
