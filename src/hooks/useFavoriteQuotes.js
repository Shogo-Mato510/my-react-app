import { useEffect, useMemo, useState } from 'react';
import {
  addFavoriteQuote,
  getFavoriteQuotes,
  isFavoriteQuote,
  removeFavoriteQuote,
  setFavoriteQuotes,
} from '../favoritesStorage';

export default function useFavoriteQuotes() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavoriteQuotes());
  }, []);

  useEffect(() => {
    setFavoriteQuotes(favorites);
    console.log('保存:', favorites);
  }, [favorites]);

  const api = useMemo(() => {
    return {
      favorites,
      isFavorite: (quote) => isFavoriteQuote(quote, favorites),
      add: (quote) => setFavorites((prev) => addFavoriteQuote(quote, prev)),
      remove: (quote) => setFavorites((prev) => removeFavoriteQuote(quote, prev)),
      clearAll: () => setFavorites([]),
    };
  }, [favorites]);

  return api;
}

