import React, { useState, useEffect, useRef } from 'react';
import { SkipBack, SkipForward } from 'lucide-react';

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
    { value: 'dijkstra', label: "Dijkstra's Shortest Path" },
    { value: 'prim', label: "Prim's MST" },
    { value: 'topological', label: 'Topological Sort' }
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
        e => (e.source === edge.source && e.target === edge.target) ||
             (e.source === edge.target && e.target === edge.source)
      );

      const isInMST = step?.mstEdges?.some(
        e => (e.source === edge.source && e.target === edge.target) ||
             (e.source === edge.target && e.target === edge.source)
      );

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      if (isInMST) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
      } else if (isHighlighted) {
        ctx.strokeStyle = '#007090';
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = '#A3BAC3';
        ctx.lineWidth = 2;
      }
      ctx.stroke();

      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      ctx.fillStyle = '#006989';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(edge.weight.toString(), midX + 5, midY - 5);
    });

    graph.nodes.forEach(node => {
      const isVisited = step?.visitedNodes?.includes(node.id);
      const isCurrent = step?.currentNode === node.id;

      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      
      if (isCurrent) {
        ctx.fillStyle = '#f59e0b';
      } else if (isVisited) {
        ctx.fillStyle = '#01A7C2';
      } else {
        ctx.fillStyle = '#EAEBED';
      }
      ctx.fill();
      ctx.strokeStyle = '#006989';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = (isVisited || isCurrent) ? '#fff' : '#006989';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  };

  const runBFS = (start) => {
    const steps = [];
    const visited = new Set();
    const queue = [start];
    
    steps.push({
      visitedNodes: [],
      currentNode: start,
      highlightedEdges: [],
      description: `Starting BFS at node ${start}`
    });

    while (queue.length > 0) {
      const node = queue.shift();
      
      if (visited.has(node)) continue;
      visited.add(node);

      const neighbors = graph.edges
        .filter(e => e.source === node || e.target === node)
        .map(e => e.source === node ? e.target : e.source)
        .filter(n => !visited.has(n));

      steps.push({
        visitedNodes: Array.from(visited),
        currentNode: node,
        highlightedEdges: neighbors.map(n => ({
          source: node,
          target: n
        })),
        description: `Visiting ${node}, exploring neighbors: ${neighbors.join(', ') || 'none'}`
      });

      queue.push(...neighbors);
    }

    return steps;
  };

  const runDFS = (start) => {
    const steps = [];
    const visited = new Set();
    
    const dfs = (node) => {
      visited.add(node);
      
      const neighbors = graph.edges
        .filter(e => e.source === node || e.target === node)
        .map(e => e.source === node ? e.target : e.source)
        .filter(n => !visited.has(n));

      steps.push({
        visitedNodes: Array.from(visited),
        currentNode: node,
        highlightedEdges: neighbors.map(n => ({
          source: node,
          target: n
        })),
        description: `Visiting ${node}, exploring neighbors: ${neighbors.join(', ') || 'none'}`
      });

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
    };

    steps.push({
      visitedNodes: [],
      currentNode: start,
      highlightedEdges: [],
      description: `Starting DFS at node ${start}`
    });

    dfs(start);
    return steps;
  };

  const runDijkstra = (start) => {
    const steps = [];
    const distances = {};
    const visited = new Set();
    const unvisited = new Set(graph.nodes.map(n => n.id));

    graph.nodes.forEach(n => {
      distances[n.id] = n.id === start ? 0 : Infinity;
    });

    steps.push({
      visitedNodes: [],
      currentNode: start,
      highlightedEdges: [],
      description: `Starting Dijkstra's algorithm at ${start}`
    });

    while (unvisited.size > 0) {
      let current = null;
      let minDist = Infinity;
      
      for (const node of unvisited) {
        if (distances[node] < minDist) {
          minDist = distances[node];
          current = node;
        }
      }

      if (current === null || distances[current] === Infinity) break;

      unvisited.delete(current);
      visited.add(current);

      const neighbors = graph.edges
        .filter(e => e.source === current || e.target === current)
        .map(e => ({
          node: e.source === current ? e.target : e.source,
          weight: e.weight
        }))
        .filter(n => unvisited.has(n.node));

      steps.push({
        visitedNodes: Array.from(visited),
        currentNode: current,
        highlightedEdges: neighbors.map(n => ({
          source: current,
          target: n.node
        })),
        description: `Visiting ${current} (distance: ${distances[current]}), updating neighbors`
      });

      for (const { node, weight } of neighbors) {
        const newDist = distances[current] + weight;
        if (newDist < distances[node]) {
          distances[node] = newDist;
        }
      }
    }

    return steps;
  };

  const runPrim = (start) => {
    const steps = [];
    const inMST = new Set([start]);
    const mstEdges = [];
    const nodes = graph.nodes.map(n => n.id);

    steps.push({
      visitedNodes: [start],
      currentNode: start,
      mstEdges: [],
      highlightedEdges: [],
      description: `Starting Prim's MST at node ${start}`
    });

    while (inMST.size < nodes.length) {
      let minEdge = null;
      let minWeight = Infinity;

      for (const edge of graph.edges) {
        const { source, target, weight } = edge;
        
        if ((inMST.has(source) && !inMST.has(target)) ||
            (inMST.has(target) && !inMST.has(source))) {
          if (weight < minWeight) {
            minWeight = weight;
            minEdge = edge;
          }
        }
      }

      if (!minEdge) break;

      const newNode = inMST.has(minEdge.source) ? minEdge.target : minEdge.source;
      inMST.add(newNode);
      mstEdges.push(minEdge);

      steps.push({
        visitedNodes: Array.from(inMST),
        currentNode: newNode,
        mstEdges: [...mstEdges],
        highlightedEdges: [minEdge],
        description: `Adding edge ${minEdge.source}-${minEdge.target} (weight: ${minEdge.weight}) to MST`
      });
    }

    const totalWeight = mstEdges.reduce((sum, e) => sum + e.weight, 0);
    steps.push({
      visitedNodes: Array.from(inMST),
      mstEdges: [...mstEdges],
      highlightedEdges: [],
      description: `MST complete! Total weight: ${totalWeight}`
    });

    return steps;
  };

  const runTopological = () => {
    const steps = [];
    const inDegree = {};
    const adjList = {};
    const sorted = [];

    graph.nodes.forEach(n => {
      inDegree[n.id] = 0;
      adjList[n.id] = [];
    });

    graph.edges.forEach(e => {
      adjList[e.source].push(e.target);
      inDegree[e.target]++;
    });

    const queue = graph.nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);

    steps.push({
      visitedNodes: [],
      highlightedEdges: [],
      description: `Starting topological sort. Nodes with in-degree 0: ${queue.join(', ')}`
    });

    while (queue.length > 0) {
      const node = queue.shift();
      sorted.push(node);

      const neighbors = adjList[node];
      
      steps.push({
        visitedNodes: [...sorted],
        currentNode: node,
        highlightedEdges: neighbors.map(n => ({ source: node, target: n })),
        description: `Processing ${node}, sorted order so far: ${sorted.join(' → ')}`
      });

      for (const neighbor of neighbors) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

    if (sorted.length !== graph.nodes.length) {
      steps.push({
        visitedNodes: sorted,
        highlightedEdges: [],
        description: 'Graph has a cycle! Topological sort not possible.'
      });
    } else {
      steps.push({
        visitedNodes: sorted,
        highlightedEdges: [],
        description: `Topological order: ${sorted.join(' → ')}`
      });
    }

    return steps;
  };

  const runAlgorithm = () => {
    let algorithmSteps = [];

    switch (algorithm) {
      case 'bfs':
        algorithmSteps = runBFS(startNode);
        break;
      case 'dfs':
        algorithmSteps = runDFS(startNode);
        break;
      case 'dijkstra':
        algorithmSteps = runDijkstra(startNode);
        break;
      case 'prim':
        algorithmSteps = runPrim(startNode);
        break;
      case 'topological':
        algorithmSteps = runTopological();
        break;
      default:
        algorithmSteps = [];
    }

    setSteps(algorithmSteps);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#006989] mb-8 text-center">
          Graph Algorithm Visualizer
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#006989] mb-6">Controls</h2>

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

                {algorithm !== 'topological' && (
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
                )}

                <button
                  onClick={runAlgorithm}
                  className="w-full bg-[#01A7C2] hover:bg-[#007090] text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  Run Algorithm
                </button>

                {steps.length > 0 && (
                  <div className="bg-[#EAEBED] rounded-lg p-4">
                    <p className="text-sm"><span className="font-semibold">Step:</span> {currentStep + 1} / {steps.length}</p>
                    <p className="text-sm mt-2"><span className="font-semibold">Description:</span> {steps[currentStep].description}</p>
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

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#006989] mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#EAEBED] border-2 border-[#006989]"></div>
                  <span>Unvisited Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#01A7C2]"></div>
                  <span>Visited Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#f59e0b]"></div>
                  <span>Current Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-[#10b981]"></div>
                  <span>MST Edge (Prim's)</span>
                </div>
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
      </div>
    </div>
  );
}

export default GraphVisualizer;