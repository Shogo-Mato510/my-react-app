import { useEffect, useState } from 'react';
import '../App.css';
import QuoteCard from '../QuoteCard';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    document.title = 'お気に入り - 名言アプリ';
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem('favorites');
    if (!raw) {
      setFavorites([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  const handleRemoveFavorite = (targetQuote) => {
    const nextFavorites = favorites.filter(
      (quote) =>
        !(
          quote.content === targetQuote.content && quote.author === targetQuote.author
        )
    );
    setFavorites(nextFavorites);
    window.localStorage.setItem('favorites', JSON.stringify(nextFavorites));
  };

  return (
    <div className="App">
      <main className="quote-card">
        <h1 className="quote-heading">お気に入り名言</h1>
        {favorites.length === 0 ? (
          <p className="quote-status">お気に入りはまだありません。</p>
        ) : (
          <div className="favorites-list">
            {favorites.map((quote) => (
              <QuoteCard
                key={`${quote.content}-${quote.author}`}
                quote={quote}
                actionLabel="削除"
                onAction={handleRemoveFavorite}
                actionClassName="quote-remove-button"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Favorites;

