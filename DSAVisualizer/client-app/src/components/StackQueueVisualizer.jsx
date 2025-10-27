import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Trash2 } from 'lucide-react';

function StackQueueVisualizer() {
  const [dataStructure, setDataStructure] = useState('stack');
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [animationType, setAnimationType] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [queueType, setQueueType] = useState('simple');

  const maxSize = 10;

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const push = () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value');
      return;
    }
    if (items.length >= maxSize) {
      showMessage('Stack is full!');
      return;
    }

    const newItem = inputValue.trim();
    setAnimationType('push');
    setAnimatingIndex(items.length);
    
    setTimeout(() => {
      setItems([...items, newItem]);
      setHistory([...history, `Push: ${newItem}`]);
      setAnimatingIndex(null);
      setInputValue('');
      showMessage(`Pushed ${newItem} to stack`);
    }, 300);
  };

  const pop = () => {
    if (items.length === 0) {
      showMessage('Stack is empty!');
      return;
    }

    const lastIndex = items.length - 1;
    const poppedItem = items[lastIndex];
    setAnimationType('pop');
    setAnimatingIndex(lastIndex);

    setTimeout(() => {
      setItems(items.slice(0, -1));
      setHistory([...history, `Pop: ${poppedItem}`]);
      setAnimatingIndex(null);
      showMessage(`Popped ${poppedItem} from stack`);
    }, 300);
  };

  const peek = () => {
    if (items.length === 0) {
      showMessage('Stack is empty!');
      return;
    }
    const topItem = items[items.length - 1];
    showMessage(`Top element: ${topItem}`);
    setHistory([...history, `Peek: ${topItem}`]);
  };

  const enqueue = () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value');
      return;
    }
    if (items.length >= maxSize) {
      showMessage('Queue is full!');
      return;
    }

    const newItem = inputValue.trim();
    setAnimationType('enqueue');
    setAnimatingIndex(items.length);
    
    setTimeout(() => {
      setItems([...items, newItem]);
      setHistory([...history, `Enqueue: ${newItem}`]);
      setAnimatingIndex(null);
      setInputValue('');
      showMessage(`Enqueued ${newItem} to queue`);
    }, 300);
  };

  const dequeue = () => {
    if (items.length === 0) {
      showMessage('Queue is empty!');
      return;
    }

    const dequeuedItem = items[0];
    setAnimationType('dequeue');
    setAnimatingIndex(0);

    setTimeout(() => {
      setItems(items.slice(1));
      setHistory([...history, `Dequeue: ${dequeuedItem}`]);
      setAnimatingIndex(null);
      showMessage(`Dequeued ${dequeuedItem} from queue`);
    }, 300);
  };

  const front = () => {
    if (items.length === 0) {
      showMessage('Queue is empty!');
      return;
    }
    const frontItem = items[0];
    showMessage(`Front element: ${frontItem}`);
    setHistory([...history, `Front: ${frontItem}`]);
  };

  const rear = () => {
    if (items.length === 0) {
      showMessage('Queue is empty!');
      return;
    }
    const rearItem = items[items.length - 1];
    showMessage(`Rear element: ${rearItem}`);
    setHistory([...history, `Rear: ${rearItem}`]);
  };

  const priorityEnqueue = () => {
    if (!inputValue.trim()) {
      showMessage('Please enter value,priority (e.g., Task,5)');
      return;
    }
    if (items.length >= maxSize) {
      showMessage('Priority Queue is full!');
      return;
    }

    const parts = inputValue.trim().split(',');
    if (parts.length !== 2 || isNaN(parseInt(parts[1]))) {
      showMessage('Format: value,priority (e.g., Task,5)');
      return;
    }

    const [value, priority] = [parts[0].trim(), parseInt(parts[1].trim())];
    const newItem = { value, priority };
    
    const newItems = [...items, newItem].sort((a, b) => b.priority - a.priority);
    
    setAnimationType('enqueue');
    setItems(newItems);
    setHistory([...history, `Enqueue: ${value} (Priority: ${priority})`]);
    setInputValue('');
    showMessage(`Enqueued ${value} with priority ${priority}`);
  };

  const clear = () => {
    setItems([]);
    setHistory([]);
    setAnimatingIndex(null);
    showMessage('Cleared all data');
  };

  const renderStack = () => (
    <div className="flex flex-col-reverse items-center justify-end gap-2 min-h-[500px] p-8">
      {items.length === 0 && (
        <div className="text-gray-400 text-lg">Stack is empty</div>
      )}
      {items.map((item, index) => (
        <div
          key={index}
          className={`w-48 h-16 bg-[#01A7C2] text-white rounded-lg flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-300 ${
            animatingIndex === index
              ? animationType === 'push'
                ? 'scale-0 opacity-0'
                : 'scale-150 opacity-0'
              : 'scale-100 opacity-100'
          }`}
          style={{
            border: index === items.length - 1 ? '3px solid #006989' : 'none'
          }}
        >
          {item}
        </div>
      ))}
      <div className="w-56 h-2 bg-gray-400 rounded-full mt-4"></div>
      <div className="text-sm text-gray-600 font-semibold">Base</div>
    </div>
  );

  const renderQueue = () => (
    <div className="flex items-center justify-center gap-2 min-h-[500px] p-8 overflow-x-auto">
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-600 font-semibold mb-2">FRONT</div>
        <div className="w-2 h-20 bg-gray-400 rounded-full"></div>
      </div>
      
      {items.length === 0 && (
        <div className="text-gray-400 text-lg mx-8">Queue is empty</div>
      )}
      
      {items.map((item, index) => (
        <div
          key={index}
          className={`w-20 h-20 bg-[#01A7C2] text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300 ${
            animatingIndex === index
              ? animationType === 'enqueue'
                ? 'scale-0 opacity-0'
                : 'scale-150 opacity-0'
              : 'scale-100 opacity-100'
          }`}
        >
          {queueType === 'priority' ? (
            <div className="text-center">
              <div className="text-sm">{item.value}</div>
              <div className="text-xs mt-1 bg-white text-[#01A7C2] px-2 py-1 rounded">P:{item.priority}</div>
            </div>
          ) : (
            item
          )}
        </div>
      ))}
      
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-600 font-semibold mb-2">REAR</div>
        <div className="w-2 h-20 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#006989] mb-8 text-center">
          Stack & Queue Visualizer
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#006989] mb-6">Controls</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Data Structure
                  </label>
                  <select
                    value={dataStructure}
                    onChange={(e) => {
                      setDataStructure(e.target.value);
                      clear();
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090]"
                  >
                    <option value="stack">Stack (LIFO)</option>
                    <option value="queue">Queue (FIFO)</option>
                    <option value="priority">Priority Queue</option>
                  </select>
                </div>

                {dataStructure === 'priority' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-gray-700">
                    <strong>Format:</strong> value,priority<br/>
                    <em>Example: Task,5</em>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {dataStructure === 'priority' ? 'Value, Priority' : 'Input Value'}
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (dataStructure === 'stack') push();
                        else if (dataStructure === 'priority') priorityEnqueue();
                        else enqueue();
                      }
                    }}
                    placeholder={dataStructure === 'priority' ? 'e.g., Task,5' : 'Enter value...'}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090]"
                  />
                </div>

                {dataStructure === 'stack' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={push}
                      disabled={items.length >= maxSize}
                      className="bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Push
                    </button>
                    <button
                      onClick={pop}
                      disabled={items.length === 0}
                      className="bg-[#007090] hover:bg-[#006989] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Pop
                    </button>
                    <button
                      onClick={peek}
                      disabled={items.length === 0}
                      className="bg-[#A3BAC3] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition col-span-2"
                    >
                      Peek
                    </button>
                  </div>
                )}

                {dataStructure === 'queue' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={enqueue}
                      disabled={items.length >= maxSize}
                      className="bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Enqueue
                    </button>
                    <button
                      onClick={dequeue}
                      disabled={items.length === 0}
                      className="bg-[#007090] hover:bg-[#006989] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Dequeue
                    </button>
                    <button
                      onClick={front}
                      disabled={items.length === 0}
                      className="bg-[#A3BAC3] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Front
                    </button>
                    <button
                      onClick={rear}
                      disabled={items.length === 0}
                      className="bg-[#A3BAC3] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Rear
                    </button>
                  </div>
                )}

                {dataStructure === 'priority' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={priorityEnqueue}
                      disabled={items.length >= maxSize}
                      className="bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition col-span-2"
                    >
                      Enqueue
                    </button>
                    <button
                      onClick={dequeue}
                      disabled={items.length === 0}
                      className="bg-[#007090] hover:bg-[#006989] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition col-span-2"
                    >
                      Dequeue (Highest Priority)
                    </button>
                  </div>
                )}

                <button
                  onClick={clear}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear All
                </button>

                <div className="bg-[#EAEBED] rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Size: {items.length} / {maxSize}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {dataStructure === 'stack' 
                      ? 'LIFO: Last In, First Out'
                      : dataStructure === 'priority'
                      ? 'Higher priority dequeued first'
                      : 'FIFO: First In, First Out'}
                  </p>
                </div>

                {message && (
                  <div className="bg-[#01A7C2] text-white rounded-lg p-3 text-center font-semibold animate-pulse">
                    {message}
                  </div>
                )}
              </div>
            </div>

            {/* Operation History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#006989] mb-3">Operation History</h3>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {history.length === 0 ? (
                  <p className="text-gray-400 text-sm">No operations yet</p>
                ) : (
                  history.slice(-10).reverse().map((op, idx) => (
                    <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                      {op}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#006989] mb-3">Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {dataStructure === 'stack' && (
                  <>
                    <p><strong>Push:</strong> Add element to top</p>
                    <p><strong>Pop:</strong> Remove top element</p>
                    <p><strong>Peek:</strong> View top element</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Time Complexity: O(1) for all operations
                    </p>
                  </>
                )}
                {dataStructure === 'queue' && (
                  <>
                    <p><strong>Enqueue:</strong> Add element to rear</p>
                    <p><strong>Dequeue:</strong> Remove front element</p>
                    <p><strong>Front:</strong> View front element</p>
                    <p><strong>Rear:</strong> View rear element</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Time Complexity: O(1) for all operations
                    </p>
                  </>
                )}
                {dataStructure === 'priority' && (
                  <>
                    <p><strong>Enqueue:</strong> Add with priority</p>
                    <p><strong>Dequeue:</strong> Remove highest priority</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Elements sorted by priority (highest first)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg">
            {dataStructure === 'stack' ? renderStack() : renderQueue()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackQueueVisualizer;