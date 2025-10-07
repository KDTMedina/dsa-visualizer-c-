import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Data Structures & Algorithms Visualizer</h1>
        <p>Interactive visualization of sorting algorithms, graph algorithms, and data structures</p>
      </div>

      <div className="features">
        <div className="feature-card">
          <h2>🔢 Sorting Algorithms</h2>
          <p>Visualize popular sorting algorithms step-by-step</p>
          <ul>
            <li>Bubble Sort</li>
            <li>Selection Sort</li>
            <li>Insertion Sort</li>
            <li>Merge Sort</li>
            <li>Quick Sort</li>
            <li>Heap Sort</li>
          </ul>
          <Link to="/sorting" className="btn">Explore Sorting</Link>
        </div>

        <div className="feature-card">
          <h2>🕸️ Graph Algorithms</h2>
          <p>Understand graph traversal and pathfinding algorithms</p>
          <ul>
            <li>Breadth-First Search</li>
            <li>Depth-First Search</li>
            <li>Dijkstra's Shortest Path</li>
            <li>Prim's MST</li>
            <li>Topological Sort</li>
          </ul>
          <Link to="/graphs" className="btn">Explore Graphs</Link>
        </div>
      </div>

      <div className="about">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Choose Algorithm</h3>
            <p>Select from various sorting or graph algorithms</p>
          </div>
          <div className="step">
            <h3>2. Configure Input</h3>
            <p>Enter your data or generate random inputs</p>
          </div>
          <div className="step">
            <h3>3. Visualize</h3>
            <p>Watch the algorithm execute step-by-step</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;