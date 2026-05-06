const STORAGE_KEY = 'favorites';

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function normalizeQuote(quote) {
  if (!quote) return null;
  const content = typeof quote.content === 'string' ? quote.content : '';
  const author = typeof quote.author === 'string' ? quote.author : '';
  if (!content.trim() || !author.trim()) return null;
  return { content, author };
}

export function getFavoriteQuotes() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(raw, []);
  if (!Array.isArray(parsed)) return [];

  const normalized = parsed
    .map(normalizeQuote)
    .filter(Boolean);

  const uniq = [];
  const seen = new Set();
  for (const q of normalized) {
    const key = `${q.content}__${q.author}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(q);
  }
  return uniq;
}

export function setFavoriteQuotes(quotes) {
  const normalized = Array.isArray(quotes)
    ? quotes.map(normalizeQuote).filter(Boolean)
    : [];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function quoteKey(quote) {
  const q = normalizeQuote(quote);
  return q ? `${q.content}__${q.author}` : '';
}

export function isFavoriteQuote(quote, favorites) {
  const key = quoteKey(quote);
  if (!key) return false;
  return favorites.some((q) => quoteKey(q) === key);
}

export function addFavoriteQuote(quote, favorites) {
  const normalized = normalizeQuote(quote);
  if (!normalized) return favorites;
  if (isFavoriteQuote(normalized, favorites)) return favorites;
  return [normalized, ...favorites];
}

export function removeFavoriteQuote(quote, favorites) {
  const key = quoteKey(quote);
  if (!key) return favorites;
  return favorites.filter((q) => quoteKey(q) !== key);
}

