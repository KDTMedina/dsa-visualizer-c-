import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SortingVisualizer.css';

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90');
  const [algorithm, setAlgorithm] = useState('bubble');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [stats, setStats] = useState(null);

  const algorithms = [
    { value: 'bubble', label: 'Bubble Sort' },
    { value: 'selection', label: 'Selection Sort' },
    { value: 'insertion', label: 'Insertion Sort' },
    { value: 'merge', label: 'Merge Sort' },
    { value: 'quick', label: 'Quick Sort' },
    { value: 'heap', label: 'Heap Sort' }
  ];

  useEffect(() => {
    parseInput();
  }, []);

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

  const parseInput = () => {
    const parsed = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    setArray(parsed);
  };

  const generateRandomArray = () => {
    const size = 10;
    const random = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(random.join(', '));
    setArray(random);
  };

  const runAlgorithm = async () => {
    try {
      setIsPlaying(false);
      setCurrentStep(0);
      
      const response = await axios.post(`/api/sorting/${algorithm}`, {
        array: array
      });

      setSteps(response.data.steps);
      setStats({
        comparisons: response.data.comparisons,
        swaps: response.data.swaps,
        time: response.data.executionTimeMs,
        name: response.data.algorithmName
      });
    } catch (error) {
      console.error('Error running algorithm:', error);
      alert('Error running algorithm. Please try again.');
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

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

  const getBarColor = (index) => {
    if (steps.length === 0) return '#3498db';
    
    const step = steps[currentStep];
    if (step.highlightIndices.includes(index)) {
      return step.highlightColor;
    }
    return '#3498db';
  };

  const currentArray = steps.length > 0 ? steps[currentStep].array : array;
  const maxValue = Math.max(...(currentArray.length > 0 ? currentArray : [100]));

  return (
    <div className="sorting-visualizer">
      <div className="controls-panel">
        <h2>Sorting Algorithm Visualizer</h2>
        
        <div className="control-group">
          <label>Select Algorithm:</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            {algorithms.map(algo => (
              <option key={algo.value} value={algo.value}>{algo.label}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Input Array (comma-separated):</label>
          <input
            type="text"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            onBlur={parseInput}
          />
        </div>

        <div className="button-group">
          <button onClick={generateRandomArray} className="btn-secondary">
            Generate Random
          </button>
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
                min="100"
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

        {stats && (
          <div className="stats">
            <h3>Statistics</h3>
            <p><strong>Algorithm:</strong> {stats.name}</p>
            <p><strong>Comparisons:</strong> {stats.comparisons}</p>
            <p><strong>Swaps:</strong> {stats.swaps}</p>
            <p><strong>Time:</strong> {stats.time}ms</p>
          </div>
        )}
      </div>

      <div className="visualization-panel">
        <div className="bars-container">
          {currentArray.map((value, index) => (
            <div
              key={index}
              className="bar"
              style={{
                height: `${(value / maxValue) * 400}px`,
                backgroundColor: getBarColor(index),
                width: `${Math.min(60, 600 / currentArray.length)}px`
              }}
            >
              <span className="bar-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SortingVisualizer;