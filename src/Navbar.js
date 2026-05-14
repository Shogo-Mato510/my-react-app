import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { clearAccessToken } from './authStorage';

function Navbar({ isDarkMode, onToggleDarkMode, favoriteCount, isLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">名言アプリ</span>
        <div className="navbar-actions">
          <nav
            className={`navbar-links${isMenuOpen ? ' open' : ''}`}
            aria-label="メインナビゲーション"
          >
            <Link className="navbar-link" to="/" onClick={closeMenu}>
              ホーム
            </Link>
            <Link className="navbar-link" to="/favorites" onClick={closeMenu}>
              お気に入り
              {favoriteCount > 0 && (
                <span className="favorites-count-badge">({favoriteCount})</span>
              )}
            </Link>
            <Link className="navbar-link" to="/about" onClick={closeMenu}>
              このアプリについて
            </Link>
            <Link className="navbar-link" to="/admin" onClick={closeMenu}>
              管理
            </Link>
            {isLoggedIn ? (
              <Link
                className="navbar-link"
                to="/login"
                onClick={() => { clearAccessToken(); closeMenu(); }}
              >
                ログアウト
              </Link>
            ) : (
              <Link className="navbar-link" to="/login" onClick={closeMenu}>
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
          <button
            type="button"
            className="hamburger-button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-label="メニューを開閉"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
