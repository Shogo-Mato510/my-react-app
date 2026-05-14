import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { setAccessToken } from '../authStorage';

const API_BASE = 'https://web-production-0a5cd.up.railway.app';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'ログイン - 名言アプリ';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setError('ユーザー名またはパスワードが間違っています');
        return;
      }
      const data = await response.json();
      const token = data?.access_token;
      if (typeof token !== 'string' || !token) {
        setError('ユーザー名またはパスワードが間違っています');
        return;
      }
      setAccessToken(token);
      navigate('/admin', { replace: true });
    } catch {
      setError('ユーザー名またはパスワードが間違っています');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-login">
      <main className="login-card">
        <h1 className="login-heading">ログイン</h1>
        <p className="login-lead">管理ページにアクセスするには認証が必要です。</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-row">
            <label className="login-label" htmlFor="login-username">
              ユーザー名
            </label>
            <input
              id="login-username"
              type="text"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={submitting}
            />
          </div>
          <div className="login-form-row">
            <label className="login-label" htmlFor="login-password">
              パスワード
            </label>
            <input
              id="login-password"
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>
          {error && (
            <p className="login-form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="login-button-submit" disabled={submitting}>
            {submitting ? 'ログイン中…' : 'ログイン'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;
