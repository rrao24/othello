import logo from './logo.svg';
import React from 'react';
import './App.css';
import Board from './components/Board'

function App() {
  return (
    <div className="App">
      <h1 className="AppHeader">🟢⚫ Othello 🟢⚫</h1>
      <Board />
    </div>
  );
}

export default App;
