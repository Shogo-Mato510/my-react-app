import './App.css';
import Profile from './Profile';
import Counter from './Counter';

function App() {
  return (
    <div className="App">
      <Profile name="SHOMA" message="Reactを学習中です" />
      <Profile name="Claude" message="AIアシスタントです" />
      <Counter />
    </div>
  );
}

export default App;
