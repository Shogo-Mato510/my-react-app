import { useEffect } from 'react';
import '../App.css';
import QuoteCard from '../QuoteCard';
import { quoteKey } from '../favoritesStorage';

function Favorites({ favorites, removeFavorite }) {

  useEffect(() => {
    document.title = 'お気に入り - 名言アプリ';
  }, []);

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
                key={quoteKey(quote)}
                quote={quote}
                actionLabel="削除"
                onAction={removeFavorite}
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

