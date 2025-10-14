import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
import axios from 'axios';

function GraphVisualizer() {
  const canvasRef = useRef(null);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [graph] = useState({
    nodes: [
      { id: 'A', label: 'A', x: 150, y: 100 },
      { id: 'B', label: 'B', x: 300, y: 100 },
      { id: 'C', label: 'C', x: 450, y: 100 },
      { id: 'D', label: 'D', x: 150, y: 250 },
      { id: 'E', label: 'E', x: 300, y: 250 },
      { id: 'F', label: 'F', x: 450, y: 250 }
    ],
    edges: [
      { source: 'A', target: 'B', weight: 4 },
      { source: 'A', target: 'D', weight: 2 },
      { source: 'B', target: 'C', weight: 3 },
      { source: 'B', target: 'E', weight: 5 },
      { source: 'C', target: 'F', weight: 6 },
      { source: 'D', target: 'E', weight: 1 },
      { source: 'E', target: 'F', weight: 7 }
    ]
  });
  const [startNode, setStartNode] = useState('A');
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);

  const algorithms = [
    { value: 'bfs', label: 'Breadth-First Search' },
    { value: 'dfs', label: 'Depth-First Search' },
    { value: 'dijkstra', label: "Dijkstra's Shortest Path" }
  ];

  useEffect(() => {
    drawGraph();
  }, [currentStep, steps]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const step = steps.length > 0 ? steps[currentStep] : null;

    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) return;

      const isHighlighted = step?.highlightedEdges?.some(
        e => (e.source === edge.source && e.target === edge.target)
      );

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.strokeStyle = isHighlighted ? '#007090' : '#A3BAC3';
      ctx.lineWidth = isHighlighted ? 4 : 2;
      ctx.stroke();

      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      ctx.fillStyle = '#006989';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(edge.weight.toString(), midX + 5, midY - 5);
    });

    graph.nodes.forEach(node => {
      const isVisited = step?.visitedNodes?.includes(node.id);

      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      ctx.fillStyle = isVisited ? '#01A7C2' : '#EAEBED';
      ctx.fill();
      ctx.strokeStyle = '#006989';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = isVisited ? '#fff' : '#006989';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  };

  const runAlgorithm = () => {
    const mockSteps = [
      { visitedNodes: [startNode], highlightedEdges: [], description: `Starting at ${startNode}` },
      { visitedNodes: [startNode, 'B'], highlightedEdges: [{ source: startNode, target: 'B' }], description: 'Visiting B' },
      { visitedNodes: [startNode, 'B', 'D'], highlightedEdges: [{ source: startNode, target: 'D' }], description: 'Visiting D' }
    ];
    setSteps(mockSteps);
    setCurrentStep(0);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#006989] mb-6">Graph Visualizer</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090]"
              >
                {algorithms.map(algo => (
                  <option key={algo.value} value={algo.value}>{algo.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Node
              </label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090]"
              >
                {graph.nodes.map(node => (
                  <option key={node.id} value={node.id}>{node.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={runAlgorithm}
              className="w-full bg-[#01A7C2] hover:bg-[#007090] text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Run Algorithm
            </button>

            {steps.length > 0 && (
              <div className="bg-[#EAEBED] rounded-lg p-4">
                <p className="text-sm"><span className="font-semibold">Step:</span> {currentStep + 1} / {steps.length}</p>
                <p className="text-sm mt-1"><span className="font-semibold">Description:</span> {steps[currentStep].description}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                    disabled={currentStep === 0}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-2 px-3 rounded-lg transition"
                  >
                    <SkipBack size={16} className="inline" />
                  </button>
                  <button
                    onClick={() => currentStep < steps.length - 1 && setCurrentStep(prev => prev + 1)}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-2 px-3 rounded-lg transition"
                  >
                    <SkipForward size={16} className="inline" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border-2 border-gray-100 rounded-lg"
        />
      </div>
    </div>
  );
}

export default GraphVisualizer;