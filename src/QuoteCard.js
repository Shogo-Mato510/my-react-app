function QuoteCard({ quote }) {
  if (!quote) return null;

  return (
    <blockquote className="quote-block">
      <p className="quote-text">&ldquo;{quote.content}&rdquo;</p>
      <cite className="quote-author">— {quote.author}</cite>
    </blockquote>
  );
}

export default QuoteCard;
