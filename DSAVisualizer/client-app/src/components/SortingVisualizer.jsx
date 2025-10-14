import React, { useState, useEffect } from 'react';
import { Menu, X, Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
import axios from 'axios';

const mockSortingAPI = (algorithm, array) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const steps = [];
      const arr = [...array];
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          steps.push({
            array: [...arr],
            highlightIndices: [j, j + 1],
            highlightColor: '#01A7C2',
            description: `Comparing ${arr[j]} and ${arr[j + 1]}`
          });
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            steps.push({
              array: [...arr],
              highlightIndices: [j, j + 1],
              highlightColor: '#007090',
              description: `Swapped ${arr[j + 1]} and ${arr[j]}`
            });
          }
        }
      }
      steps.push({
        array: [...arr],
        highlightIndices: [],
        highlightColor: '#006989',
        description: 'Sorting complete!'
      });
      resolve({
        steps,
        comparisons: steps.length,
        swaps: Math.floor(steps.length / 2),
        executionTimeMs: 5,
        algorithmName: algorithm
      });
    }, 100);
  });
};

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
    setIsPlaying(false);
    setCurrentStep(0);
    const response = await mockSortingAPI(algorithm, array);
    setSteps(response.steps);
    setStats({
      comparisons: response.comparisons,
      swaps: response.swaps,
      time: response.executionTimeMs,
      name: response.algorithmName
    });
  };

  const getBarColor = (index) => {
    if (steps.length === 0) return '#01A7C2';
    const step = steps[currentStep];
    if (step.highlightIndices.includes(index)) {
      return step.highlightColor;
    }
    return '#01A7C2';
  };

  const currentArray = steps.length > 0 ? steps[currentStep].array : array;
  const maxValue = Math.max(...(currentArray.length > 0 ? currentArray : [100]));

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Controls Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#006989] mb-6">Sorting Visualizer</h2>

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
                Input Array (comma-separated)
              </label>
              <input
                type="text"
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                onBlur={parseInput}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateRandomArray}
                className="flex-1 bg-[#A3BAC3] hover:bg-[#007090] text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Shuffle size={18} />
                Random
              </button>
              <button
                onClick={runAlgorithm}
                className="flex-1 bg-[#01A7C2] hover:bg-[#007090] text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Run
              </button>
            </div>

            {steps.length > 0 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speed: {speed}ms
                  </label>
                  <input
                    type="range"
                    min="100"
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
                    Previous
                  </button>
                  {isPlaying ? (
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="bg-[#007090] hover:bg-[#006989] text-white font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <Pause size={16} />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsPlaying(true)}
                      disabled={currentStep >= steps.length - 1}
                      className="bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <Play size={16} />
                      Play
                    </button>
                  )}
                  <button
                    onClick={() => currentStep < steps.length - 1 && setCurrentStep(prev => prev + 1)}
                    disabled={currentStep >= steps.length - 1}
                    className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                  >
                    Next
                    <SkipForward size={16} />
                  </button>
                  <button
                    onClick={() => { setIsPlaying(false); setCurrentStep(0); }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>

                <div className="bg-[#EAEBED] rounded-lg p-4">
                  <p className="text-sm"><span className="font-semibold">Step:</span> {currentStep + 1} / {steps.length}</p>
                  <p className="text-sm mt-1"><span className="font-semibold">Description:</span> {steps[currentStep].description}</p>
                </div>
              </>
            )}

            {stats && (
              <div className="bg-[#006989] text-white rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Statistics</h3>
                <p className="text-sm"><span className="font-semibold">Algorithm:</span> {stats.name}</p>
                <p className="text-sm"><span className="font-semibold">Comparisons:</span> {stats.comparisons}</p>
                <p className="text-sm"><span className="font-semibold">Swaps:</span> {stats.swaps}</p>
                <p className="text-sm"><span className="font-semibold">Time:</span> {stats.time}ms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center items-end gap-2 h-[500px] overflow-x-auto">
          {currentArray.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="rounded-t-lg transition-all duration-300"
                style={{
                  height: `${(value / maxValue) * 400}px`,
                  backgroundColor: getBarColor(index),
                  width: `${Math.min(60, 600 / currentArray.length)}px`
                }}
              />
              <span className="text-xs mt-2 font-semibold text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default SortingVisualizer;