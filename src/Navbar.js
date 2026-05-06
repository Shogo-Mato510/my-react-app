import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">名言アプリ</span>
        <nav className="navbar-links" aria-label="メインナビゲーション">
          <Link className="navbar-link" to="/">
            ホーム
          </Link>
          <Link className="navbar-link" to="/favorites">
            お気に入り
          </Link>
          <Link className="navbar-link" to="/about">
            このアプリについて
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
