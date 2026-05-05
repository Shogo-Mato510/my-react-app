import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section className="counter-card">
      <h2>カウンター</h2>
      <p className="count-value">{count}</p>
      <div className="counter-actions">
        <button type="button" onClick={() => setCount(count + 1)}>
          +1
        </button>
        <button type="button" onClick={() => setCount(0)}>
          リセット
        </button>
      </div>
    </section>
  );
}

export default Counter;
