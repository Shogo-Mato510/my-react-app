import { useState, useEffect } from 'react';
import './App.css';
import QuoteCard from './QuoteCard';
import FetchButton from './FetchButton';

const QUOTES = [
  {
    content: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    content: '千里の道も一歩から。',
    author: '老子（伝）',
  },
  {
    content: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
  },
  {
    content: '七転び八起き。',
    author: 'ことわざ',
  },
  {
    content: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
  },
  {
    content: 'できると思えば、できる。',
    author: '亨利・フォード（意訳）',
  },
  {
    content: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
  },
  {
    content: '失敗は成功のもと。',
    author: 'ことわざ',
  },
  {
    content: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  },
  {
    content: '為せば成る。',
    author: '上杉鷹山（伝）',
  },
];

function pickRandomQuote(current) {
  if (QUOTES.length <= 1) return QUOTES[0];
  let next;
  do {
    next = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  } while (
    current &&
    next.content === current.content &&
    next.author === current.author
  );
  return next;
}

function App() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    document.title =
      fetchCount === 0
        ? '名言アプリ'
        : `名言アプリ（${fetchCount}回取得済み）`;
  }, [fetchCount]);

  useEffect(() => {
    setLoading(true);
    const timerId = setTimeout(() => {
      setQuote(pickRandomQuote(null));
      setFetchCount((c) => c + 1);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timerId);
  }, []);

  const handleNewQuote = () => {
    setQuote((prev) => pickRandomQuote(prev));
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

        {!loading && <QuoteCard quote={quote} />}

        <FetchButton onClick={handleNewQuote} loading={loading} />
      </main>
    </div>
  );
}

export default App;
