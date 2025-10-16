import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Plus, Trash2 } from 'lucide-react';

function TreeVisualizer() {
  const canvasRef = useRef(null);
  const [algorithm, setAlgorithm] = useState('inorder');
  const [tree, setTree] = useState({
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: { value: 40, left: null, right: null }
    },
    right: {
      value: 70,
      left: { value: 60, left: null, right: null },
      right: { value: 80, left: null, right: null }
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const algorithms = [
    { value: 'inorder', label: 'In-Order Traversal' },
    { value: 'preorder', label: 'Pre-Order Traversal' },
    { value: 'postorder', label: 'Post-Order Traversal' },
    { value: 'levelorder', label: 'Level-Order Traversal' },
    { value: 'search', label: 'BST Search' },
    { value: 'insert', label: 'BST Insert' },
    { value: 'delete', label: 'BST Delete' }
  ];

  useEffect(() => {
    drawTree();
  }, [tree, currentStep, steps]);

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

  const calculateNodePositions = (node, x, y, level, horizontalSpacing) => {
    if (!node) return [];
    
    const positions = [{ node, x, y, level }];
    const spacing = horizontalSpacing / Math.pow(2, level);
    
    if (node.left) {
      positions.push(...calculateNodePositions(node.left, x - spacing, y + 80, level + 1, horizontalSpacing));
    }
    if (node.right) {
      positions.push(...calculateNodePositions(node.right, x + spacing, y + 80, level + 1, horizontalSpacing));
    }
    
    return positions;
  };

  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = calculateNodePositions(tree, 400, 50, 1, 200);
    const step = steps.length > 0 ? steps[currentStep] : null;

    // Draw edges
    positions.forEach(({ node, x, y }) => {
      if (node.left) {
        const leftPos = positions.find(p => p.node === node.left);
        if (leftPos) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(leftPos.x, leftPos.y);
          ctx.strokeStyle = '#A3BAC3';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      if (node.right) {
        const rightPos = positions.find(p => p.node === node.right);
        if (rightPos) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(rightPos.x, rightPos.y);
          ctx.strokeStyle = '#A3BAC3';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    // Draw nodes
    positions.forEach(({ node, x, y }) => {
      const isVisited = step?.visitedNodes?.includes(node.value);
      const isCurrent = step?.currentNode === node.value;
      const isHighlighted = step?.highlightedNodes?.includes(node.value);

      ctx.beginPath();
      ctx.arc(x, y, 25, 0, 2 * Math.PI);
      
      if (isCurrent) {
        ctx.fillStyle = '#f59e0b';
      } else if (isHighlighted) {
        ctx.fillStyle = '#10b981';
      } else if (isVisited) {
        ctx.fillStyle = '#01A7C2';
      } else {
        ctx.fillStyle = '#EAEBED';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#006989';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = (isVisited || isCurrent || isHighlighted) ? '#fff' : '#006989';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), x, y);
    });
  };

  const inOrderTraversal = (node, steps = [], visited = []) => {
    if (!node) return;

    if (node.left) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `Moving to left child of ${node.value}`
      });
      inOrderTraversal(node.left, steps, visited);
    }

    visited.push(node.value);
    steps.push({
      visitedNodes: [...visited],
      currentNode: node.value,
      description: `Visiting node ${node.value}`
    });

    if (node.right) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `Moving to right child of ${node.value}`
      });
      inOrderTraversal(node.right, steps, visited);
    }

    return steps;
  };

  const preOrderTraversal = (node, steps = [], visited = []) => {
    if (!node) return;

    visited.push(node.value);
    steps.push({
      visitedNodes: [...visited],
      currentNode: node.value,
      description: `Visiting node ${node.value}`
    });

    if (node.left) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `Moving to left child of ${node.value}`
      });
      preOrderTraversal(node.left, steps, visited);
    }

    if (node.right) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `Moving to right child of ${node.value}`
      });
      preOrderTraversal(node.right, steps, visited);
    }

    return steps;
  };

  const postOrderTraversal = (node, steps = [], visited = []) => {
    if (!node) return;

    if (node.left) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `Moving to left child of ${node.value}`
      });
      postOrderTraversal(node.left, steps, visited);
    }

    if (node.right) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `Moving to right child of ${node.value}`
      });
      postOrderTraversal(node.right, steps, visited);
    }

    visited.push(node.value);
    steps.push({
      visitedNodes: [...visited],
      currentNode: node.value,
      description: `Visiting node ${node.value}`
    });

    return steps;
  };

  const levelOrderTraversal = (root) => {
    const steps = [];
    const queue = [root];
    const visited = [];

    steps.push({
      visitedNodes: [],
      currentNode: root.value,
      description: `Starting level-order traversal at root ${root.value}`
    });

    while (queue.length > 0) {
      const node = queue.shift();
      visited.push(node.value);

      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `Visiting node ${node.value}`
      });

      if (node.left) {
        queue.push(node.left);
        steps.push({
          visitedNodes: [...visited],
          currentNode: node.value,
          description: `Added left child ${node.left.value} to queue`
        });
      }

      if (node.right) {
        queue.push(node.right);
        steps.push({
          visitedNodes: [...visited],
          currentNode: node.value,
          description: `Added right child ${node.right.value} to queue`
        });
      }
    }

    return steps;
  };

  const searchBST = (node, target, steps = [], visited = []) => {
    if (!node) {
      steps.push({
        visitedNodes: [...visited],
        description: `Value ${target} not found in tree`
      });
      return steps;
    }

    visited.push(node.value);
    steps.push({
      visitedNodes: [...visited],
      currentNode: node.value,
      description: `Checking node ${node.value}, searching for ${target}`
    });

    if (node.value === target) {
      steps.push({
        visitedNodes: [...visited],
        highlightedNodes: [node.value],
        description: `Found ${target}!`
      });
      return steps;
    }

    if (target < node.value) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `${target} < ${node.value}, going left`
      });
      return searchBST(node.left, target, steps, visited);
    } else {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `${target} > ${node.value}, going right`
      });
      return searchBST(node.right, target, steps, visited);
    }
  };

  const insertBST = (node, value, steps = [], visited = [], parent = null, direction = '') => {
    if (!node) {
      steps.push({
        visitedNodes: [...visited],
        highlightedNodes: [value],
        description: `Inserting ${value} as ${direction} child${parent ? ` of ${parent}` : ' (new root)'}`
      });
      return { value, left: null, right: null };
    }

    visited.push(node.value);
    steps.push({
      visitedNodes: [...visited],
      currentNode: node.value,
      description: `Checking node ${node.value}, inserting ${value}`
    });

    if (value < node.value) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `${value} < ${node.value}, going left`
      });
      node.left = insertBST(node.left, value, steps, visited, node.value, 'left');
    } else if (value > node.value) {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `${value} > ${node.value}, going right`
      });
      node.right = insertBST(node.right, value, steps, visited, node.value, 'right');
    } else {
      steps.push({
        visitedNodes: [...visited],
        currentNode: node.value,
        description: `${value} already exists in tree`
      });
    }

    return node;
  };

  const runAlgorithm = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    let algorithmSteps = [];

    switch (algorithm) {
      case 'inorder':
        algorithmSteps = inOrderTraversal(tree) || [];
        break;
      case 'preorder':
        algorithmSteps = preOrderTraversal(tree) || [];
        break;
      case 'postorder':
        algorithmSteps = postOrderTraversal(tree) || [];
        break;
      case 'levelorder':
        algorithmSteps = levelOrderTraversal(tree);
        break;
      case 'search':
        if (inputValue) {
          algorithmSteps = searchBST(tree, parseInt(inputValue)) || [];
        }
        break;
      case 'insert':
        if (inputValue) {
          algorithmSteps = [];
          const newTree = JSON.parse(JSON.stringify(tree));
          insertBST(newTree, parseInt(inputValue), algorithmSteps, []);
          setTree(newTree);
        }
        break;
      case 'delete':
        algorithmSteps = [{ visitedNodes: [], description: 'Delete operation - coming soon!' }];
        break;
      default:
        algorithmSteps = [];
    }

    setSteps(algorithmSteps);
  };

  const resetTree = () => {
    setTree({
      value: 50,
      left: {
        value: 30,
        left: { value: 20, left: null, right: null },
        right: { value: 40, left: null, right: null }
      },
      right: {
        value: 70,
        left: { value: 60, left: null, right: null },
        right: { value: 80, left: null, right: null }
      }
    });
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const needsInput = ['search', 'insert', 'delete'].includes(algorithm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#006989] mb-8 text-center">
          Tree Algorithm Visualizer
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
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

                {needsInput && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {algorithm === 'search' ? 'Search Value' : 
                       algorithm === 'insert' ? 'Insert Value' : 'Delete Value'}
                    </label>
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a number"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090]"
                    />
                  </div>
                )}

                <button
                  onClick={runAlgorithm}
                  disabled={needsInput && !inputValue}
                  className="w-full bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  Run Algorithm
                </button>

                <button
                  onClick={resetTree}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Reset Tree
                </button>

                {steps.length > 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Speed: {speed}ms
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="2000"
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                        disabled={currentStep === 0}
                        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <SkipBack size={16} />
                      </button>
                      {isPlaying ? (
                        <button
                          onClick={() => setIsPlaying(false)}
                          className="bg-[#007090] hover:bg-[#006989] text-white font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                        >
                          <Pause size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsPlaying(true)}
                          disabled={currentStep >= steps.length - 1}
                          className="bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                        >
                          <Play size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => currentStep < steps.length - 1 && setCurrentStep(prev => prev + 1)}
                        disabled={currentStep >= steps.length - 1}
                        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <SkipForward size={16} />
                      </button>
                      <button
                        onClick={() => { setIsPlaying(false); setCurrentStep(0); }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>

                    <div className="bg-[#EAEBED] rounded-lg p-4">
                      <p className="text-sm"><span className="font-semibold">Step:</span> {currentStep + 1} / {steps.length}</p>
                      <p className="text-sm mt-2"><span className="font-semibold">Description:</span> {steps[currentStep].description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Legend Section */}
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
                  <div className="w-6 h-6 rounded-full bg-[#10b981]"></div>
                  <span>Found/Inserted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="border-2 border-gray-100 rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreeVisualizer;