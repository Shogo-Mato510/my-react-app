import { useState, useEffect } from 'react';
import '../App.css';
import QuoteCard from '../QuoteCard';
import FetchButton from '../FetchButton';

function pickRandomQuote(quotes, current) {
  if (!quotes.length) return null;
  if (quotes.length <= 1) return quotes[0];
  let next;
  do {
    next = quotes[Math.floor(Math.random() * quotes.length)];
  } while (
    current &&
    next.content === current.content &&
    next.author === current.author
  );
  return next;
}

function Home({ isFavorite, addFavorite }) {
  const [quote, setQuote] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryQuote, setCategoryQuote] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    document.title =
      fetchCount === 0
        ? '名言アプリ'
        : `名言アプリ（${fetchCount}回取得済み）`;
  }, [fetchCount]);

  useEffect(() => {
    let isMounted = true;

    const fetchQuotes = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch('http://127.0.0.1:8000/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid items data');
        }

        if (!isMounted) return;

        setQuotes(data);
        setQuote(pickRandomQuote(data, null));
        setFetchCount((c) => c + 1);
      } catch (e) {
        if (!isMounted) return;
        setError(true);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchQuotes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/quotes/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        if (!isMounted) return;
        const list = Array.isArray(data.categories) ? data.categories : [];
        setCategories(list);
        if (list.length > 0) setSelectedCategory(list[0]);
      } catch (e) {
        // categories section simply won't render
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  const handleCategoryFetch = async () => {
    if (!selectedCategory) return;
    setCategoryLoading(true);
    setCategoryError(false);
    setCategoryQuote(null);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/quotes/random?category=${encodeURIComponent(selectedCategory)}`
      );
      if (!res.ok) throw new Error('Failed to fetch category quote');
      setCategoryQuote(await res.json());
    } catch (e) {
      setCategoryError(true);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleNewQuote = () => {
    setQuote((prev) => pickRandomQuote(quotes, prev));
    setFetchCount((c) => c + 1);
  };

  return (
    <div className="App">
      <main className="quote-card">
        <h1 className="quote-heading">ランダム名言</h1>

        <p className="quote-counter" aria-live="polite">
          名言を取得した回数：<strong>{fetchCount}</strong>回
        </p>

        {loading && <p className="quote-status">読み込み中...</p>}

        {!loading && error && (
          <p className="quote-status">データの取得に失敗しました</p>
        )}

        {!loading && !error && (
          <QuoteCard
            quote={quote}
            actionLabel={
              quote && isFavorite(quote)
                ? '★ お気に入り済み'
                : '★ お気に入りに追加'
            }
            onAction={addFavorite}
            actionDisabled={quote ? isFavorite(quote) : true}
          />
        )}

        <FetchButton onClick={handleNewQuote} loading={loading || error} />

        <div className="category-section">
          <h2 className="category-heading">カテゴリから探す</h2>
          <div className="category-row">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCategoryQuote(null);
                setCategoryError(false);
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              className="category-button"
              onClick={handleCategoryFetch}
              disabled={categoryLoading || !selectedCategory}
            >
              {categoryLoading ? '取得中...' : 'このカテゴリの名言を取得'}
            </button>
          </div>

          {categoryError && (
            <p className="quote-status">カテゴリの名言取得に失敗しました</p>
          )}

          {categoryQuote && !categoryError && (
            <QuoteCard
              quote={categoryQuote}
              actionLabel={
                isFavorite(categoryQuote) ? '★ お気に入り済み' : '★ お気に入りに追加'
              }
              onAction={addFavorite}
              actionDisabled={isFavorite(categoryQuote)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
