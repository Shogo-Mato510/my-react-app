function Profile({ name, message }) {
  return (
    <main className="intro-card">
      <h1>こんにちは！{name}です。</h1>
      <p>{message}</p>
      <p>今日の日付：2026年5月5日</p>
    </main>
  );
}

export default Profile;
