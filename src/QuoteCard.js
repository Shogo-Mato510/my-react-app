function QuoteCard({
  quote,
  actionLabel,
  onAction,
  actionClassName = 'quote-sub-button',
  actionDisabled = false,
}) {
  if (!quote) return null;

  return (
    <blockquote className="quote-block">
      <p className="quote-text">&ldquo;{quote.content}&rdquo;</p>
      <cite className="quote-author">— {quote.author}</cite>
      {actionLabel && onAction && (
        <button
          type="button"
          className={actionClassName}
          onClick={() => onAction(quote)}
          disabled={actionDisabled}
        >
          {actionLabel}
        </button>
      )}
    </blockquote>
  );
}

export default QuoteCard;
