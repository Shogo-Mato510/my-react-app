import { useEffect } from 'react';
import '../App.css';

function About() {
  useEffect(() => {
    document.title = 'このアプリについて - 名言アプリ';
  }, []);

  return (
    <div className="page-about">
      <main className="about-card">
        <h1 className="about-heading">このアプリについて</h1>
        <p className="about-lead">
          名言アプリは、あらかじめ用意した名言からランダムに1件を表示するReactアプリです。
        </p>
        <ul className="about-list">
          <li>画面を開いてから1秒後に名言が表示されます（読み込み表示の体験用）。</li>
          <li>「新しい名言を取得」ボタンで、別の名言に切り替えられます。</li>
          <li>取得した回数が画面とブラウザタブのタイトルに反映されます。</li>
        </ul>
        <p className="about-footer">
          ナビゲーションの「ホーム」からいつでも名言ページに戻れます。
        </p>
      </main>
    </div>
  );
}

export default About;
