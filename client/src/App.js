import React from 'react';
import './App.css';
//import Article from './components/Article';
import ArticleDisplay from './components/ArticleDisplay';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <header><Navbar /></header>
      <ArticleDisplay />
    </div>
  );
}

export default App;
