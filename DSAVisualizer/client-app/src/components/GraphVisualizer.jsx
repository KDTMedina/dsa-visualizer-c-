import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GraphVisualizer.css';

function GraphVisualizer() {
  const canvasRef = useRef(null);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [graph, setGraph] = useState({
    nodes: [
      { id: 'A', label: 'A', x: 150, y: 100 },
      { id: 'B', label: 'B', x: 300, y: 100 },
      { id: 'C', label: 'C', x: 450, y: 100 },
      { id: 'D', label: 'D', x: 150, y: 250 },
      { id: 'E', label: 'E', x: 300, y: 250 },
      { id: 'F', label: 'F', x: 450, y: 250 }
    ],
    edges: [
      { source: 'A', target: 'B', weight: 4, isDirected: false },
      { source: 'A', target: 'D', weight: 2, isDirected: false },
      { source: 'B', target: 'C', weight: 3, isDirected: false },
      { source: 'B', target: 'E', weight: 5, isDirected: false },
      { source: 'C', target: 'F', weight: 6, isDirected: false },
      { source: 'D', target: 'E', weight: 1, isDirected: false },
      { source: 'E', target: 'F', weight: 7, isDirected: false }
    ]
  });
  const [startNode, setStartNode] = useState('A');
  const [endNode, setEndNode] = useState('F');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [result, setResult] = useState(null);

  const algorithms = [
    { value: 'bfs', label: 'Breadth-First Search', needsEnd: false },
    { value: 'dfs', label: 'Depth-First Search', needsEnd: false },
    { value: 'dijkstra', label: "Dijkstra's Shortest Path", needsEnd: true },
    { value: 'prim', label: "Prim's MST", needsEnd: false },
    { value: 'kruskal', label: "Kruskal's MST", needsEnd: false },
    { value: 'topological-dfs', label: 'Topological Sort (DFS)', needsEnd: false },
    { value: 'topological-indegree', label: 'Topological Sort (Indegree)', needsEnd: false },
    { value: 'floyd-warshall', label: 'Floyd-Warshall (All Pairs)', needsEnd: false },
    { value: 'connected-components', label: 'Connected Components', needsEnd: false }
  ];

  useEffect(() => {
    drawGraph();
  }, [graph, steps, currentStep]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const step = steps.length > 0 ? steps[currentStep] : null;

    // Draw edges
    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) return;

      const isHighlighted = step?.highlightedEdges.some(
        e => (e.source === edge.source && e.target === edge.target) ||
             (!edge.isDirected && e.source === edge.target && e.target === edge.source)
      );

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.strokeStyle = isHighlighted ? '#e74c3c' : '#95a5a6';
      ctx.lineWidth = isHighlighted ? 4 : 2;
      ctx.stroke();

      // Draw weight
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(edge.weight.toString(), midX + 5, midY - 5);
    });

    // Draw nodes
    graph.nodes.forEach(node => {
      const isVisited = step?.visitedNodes.includes(node.id);
      const distance = step?.nodeDistances?.[node.id];

      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      ctx.fillStyle = isVisited ? '#2ecc71' : '#3498db';
      ctx.fill();
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // Draw distance (for Dijkstra)
      if (distance !== undefined && distance !== Infinity) {
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`d:${distance}`, node.x, node.y + 40);
      }
    });
  };

  const runAlgorithm = async () => {
    try {
      setIsPlaying(false);
      setCurrentStep(0);

      const selectedAlgo = algorithms.find(a => a.value === algorithm);
      const requestData = {
        graph: graph,
        algorithm: algorithm,
        startNode: startNode
      };

      if (selectedAlgo?.needsEnd) {
        requestData.endNode = endNode;
      }

      const response = await axios.post(`/api/graph/${algorithm}`, requestData);

      setSteps(response.data.steps);
      setResult(response.data.result);
    } catch (error) {
      console.error('Error running algorithm:', error);
      alert('Error running algorithm. Please check your graph configuration.');
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const selectedAlgo = algorithms.find(a => a.value === algorithm);

  return (
    <div className="graph-visualizer">
      <div className="controls-panel">
        <h2>Graph Algorithm Visualizer</h2>

        <div className="control-group">
          <label>Select Algorithm:</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            {algorithms.map(algo => (
              <option key={algo.value} value={algo.value}>{algo.label}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Start Node:</label>
          <select value={startNode} onChange={(e) => setStartNode(e.target.value)}>
            {graph.nodes.map(node => (
              <option key={node.id} value={node.id}>{node.label}</option>
            ))}
          </select>
        </div>

        {selectedAlgo?.needsEnd && (
          <div className="control-group">
            <label>End Node:</label>
            <select value={endNode} onChange={(e) => setEndNode(e.target.value)}>
              {graph.nodes.map(node => (
                <option key={node.id} value={node.id}>{node.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="button-group">
          <button onClick={runAlgorithm} className="btn-primary">
            Run Algorithm
          </button>
        </div>

        {steps.length > 0 && (
          <>
            <div className="control-group">
              <label>Speed: {speed}ms</label>
              <input
                type="range"
                min="200"
                max="2000"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
              />
            </div>

            <div className="playback-controls">
              <button onClick={handlePrevious} disabled={currentStep === 0}>
                ⏮ Previous
              </button>
              {isPlaying ? (
                <button onClick={handlePause}>⏸ Pause</button>
              ) : (
                <button onClick={handlePlay} disabled={currentStep >= steps.length - 1}>
                  ▶ Play
                </button>
              )}
              <button onClick={handleNext} disabled={currentStep >= steps.length - 1}>
                Next ⏭
              </button>
              <button onClick={handleReset}>🔄 Reset</button>
            </div>

            <div className="step-info">
              <p><strong>Step:</strong> {currentStep + 1} / {steps.length}</p>
              <p><strong>Description:</strong> {steps[currentStep].description}</p>
            </div>
          </>
        )}

        {result && (
          <div className="stats">
            <h3>Results</h3>
            {result.visitOrder && (
              <p><strong>Visit Order:</strong> {result.visitOrder.join(' → ')}</p>
            )}
            {result.shortestPath && (
              <>
                <p><strong>Shortest Path:</strong> {result.shortestPath.join(' → ')}</p>
                <p><strong>Distance:</strong> {result.distance}</p>
              </>
            )}
            {result.totalWeight !== undefined && (
              <p><strong>Total Weight:</strong> {result.totalWeight}</p>
            )}
            {result.topologicalOrder && (
              <p><strong>Order:</strong> {result.topologicalOrder.join(' → ')}</p>
            )}
          </div>
        )}
      </div>

      <div className="visualization-panel">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="graph-canvas"
        />
      </div>
    </div>
  );
}

export default GraphVisualizer;