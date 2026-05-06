function FetchButton({ onClick, loading }) {
  return (
    <button
      type="button"
      className="quote-button"
      onClick={onClick}
      disabled={loading}
    >
      新しい名言を取得
    </button>
  );
}

export default FetchButton;
