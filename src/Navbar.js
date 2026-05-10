import { Link } from 'react-router-dom';
import './Navbar.css';
import { clearAccessToken } from './authStorage';

function Navbar({ isDarkMode, onToggleDarkMode, favoriteCount, isLoggedIn }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">名言アプリ</span>
        <div className="navbar-actions">
          <nav className="navbar-links" aria-label="メインナビゲーション">
            <Link className="navbar-link" to="/">
              ホーム
            </Link>
            <Link className="navbar-link" to="/favorites">
              お気に入り
              {favoriteCount > 0 && (
                <span className="favorites-count-badge">({favoriteCount})</span>
              )}
            </Link>
            <Link className="navbar-link" to="/about">
              このアプリについて
            </Link>
            <Link className="navbar-link" to="/admin">
              管理
            </Link>
            {isLoggedIn ? (
              <Link
                className="navbar-link"
                to="/login"
                onClick={() => clearAccessToken()}
              >
                ログアウト
              </Link>
            ) : (
              <Link className="navbar-link" to="/login">
                ログイン
              </Link>
            )}
          </nav>
          <button
            type="button"
            className="theme-toggle-button"
            onClick={onToggleDarkMode}
          >
            {isDarkMode ? 'ライトモード' : 'ダークモード'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
