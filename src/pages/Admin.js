import { useCallback, useEffect, useState } from 'react';
import '../App.css';

const API_BASE = 'http://127.0.0.1:8000';

function Admin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [posting, setPosting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadItems = useCallback(async () => {
    setListError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/items`);
      if (!response.ok) {
        throw new Error('一覧の取得に失敗しました');
      }
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setListError('サーバーに接続できません。APIが起動しているか確認してください。');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = '管理 - 名言アプリ';
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const trimmedContent = content.trim();
    const trimmedAuthor = author.trim();
    if (!trimmedContent || !trimmedAuthor) {
      setFormError('名言と著者の両方を入力してください。');
      return;
    }

    setPosting(true);
    try {
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmedContent, author: trimmedAuthor }),
      });
      if (!response.ok) {
        throw new Error('追加に失敗しました');
      }
      setContent('');
      setAuthor('');
      await loadItems();
    } catch {
      setFormError('追加に失敗しました。もう一度お試しください。');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }
      await loadItems();
    } catch {
      await loadItems();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-admin">
      <main className="admin-card">
        <h1 className="admin-heading">名言の管理</h1>
        <p className="admin-lead">
          FastAPI の <code className="admin-code">/items</code> を操作して名言を追加・削除できます。
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <label className="admin-label" htmlFor="admin-content">
              名言（content）
            </label>
            <textarea
              id="admin-content"
              className="admin-input admin-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="名言の本文"
              disabled={posting}
            />
          </div>
          <div className="admin-form-row">
            <label className="admin-label" htmlFor="admin-author">
              著者（author）
            </label>
            <input
              id="admin-author"
              type="text"
              className="admin-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="著者名"
              disabled={posting}
            />
          </div>
          {formError && (
            <p className="admin-form-error" role="alert">
              {formError}
            </p>
          )}
          <button type="submit" className="admin-button-primary" disabled={posting}>
            {posting ? '送信中…' : 'POST で追加'}
          </button>
        </form>

        <section className="admin-list-section" aria-labelledby="admin-list-heading">
          <h2 id="admin-list-heading" className="admin-subheading">
            登録済みの名言
          </h2>
          {loading && <p className="admin-status">読み込み中…</p>}
          {!loading && listError && (
            <p className="admin-status admin-status-error" role="alert">
              {listError}
            </p>
          )}
          {!loading && !listError && items.length === 0 && (
            <p className="admin-status">まだ名言がありません。</p>
          )}
          {!loading && items.length > 0 && (
            <ul className="admin-item-list">
              {items.map((item) => (
                <li key={item.id} className="admin-item-row">
                  <div className="admin-item-body">
                    <span className="admin-item-id">#{item.id}</span>
                    <p className="admin-item-content">&ldquo;{item.content}&rdquo;</p>
                    <p className="admin-item-author">— {item.author}</p>
                  </div>
                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? '削除中…' : '削除'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default Admin;
