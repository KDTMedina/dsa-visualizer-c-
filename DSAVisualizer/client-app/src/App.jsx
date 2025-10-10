import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import SortingVisualizer from './components/SortingVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>DSA Visualizer</h1>
          </div>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sorting">Sorting Algorithms</Link></li>
            <li><Link to="/graphs">Graph Algorithms</Link></li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sorting" element={<SortingVisualizer />} />
            <Route path="/graphs" element={<GraphVisualizer />} />
          </Routes>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <p>{new Date().getFullYear()} © KD Medina</p>
            <div className="footer-links">
              <a href="https://github.com/KDTMedina" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://linkedin.com/in/kdtmedina" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;