import React, { useState } from 'react';
import { ArrowRight, Trash2, Search } from 'lucide-react';

function LinkedListVisualizer() {
  const [listType, setListType] = useState('singly');
  const [nodes, setNodes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const maxSize = 10;

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const insertAtBeginning = () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value');
      return;
    }
    if (nodes.length >= maxSize) {
      showMessage('List is full!');
      return;
    }

    const newNode = { value: inputValue.trim(), id: Date.now() };
    setNodes([newNode, ...nodes]);
    setHistory([...history, `Insert at beginning: ${inputValue}`]);
    setInputValue('');
    showMessage(`Inserted ${inputValue} at beginning`);
  };

  const insertAtEnd = () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value');
      return;
    }
    if (nodes.length >= maxSize) {
      showMessage('List is full!');
      return;
    }

    const newNode = { value: inputValue.trim(), id: Date.now() };
    setNodes([...nodes, newNode]);
    setHistory([...history, `Insert at end: ${inputValue}`]);
    setInputValue('');
    showMessage(`Inserted ${inputValue} at end`);
  };

  const insertAtPosition = () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value');
      return;
    }
    const pos = parseInt(position);
    if (isNaN(pos) || pos < 0 || pos > nodes.length) {
      showMessage(`Position must be between 0 and ${nodes.length}`);
      return;
    }
    if (nodes.length >= maxSize) {
      showMessage('List is full!');
      return;
    }

    const newNode = { value: inputValue.trim(), id: Date.now() };
    const newNodes = [...nodes];
    newNodes.splice(pos, 0, newNode);
    setNodes(newNodes);
    setHistory([...history, `Insert ${inputValue} at position ${pos}`]);
    setInputValue('');
    setPosition('');
    showMessage(`Inserted ${inputValue} at position ${pos}`);
  };

  const deleteFromBeginning = () => {
    if (nodes.length === 0) {
      showMessage('List is empty!');
      return;
    }

    const deletedValue = nodes[0].value;
    setNodes(nodes.slice(1));
    setHistory([...history, `Delete from beginning: ${deletedValue}`]);
    showMessage(`Deleted ${deletedValue} from beginning`);
  };

  const deleteFromEnd = () => {
    if (nodes.length === 0) {
      showMessage('List is empty!');
      return;
    }

    const deletedValue = nodes[nodes.length - 1].value;
    setNodes(nodes.slice(0, -1));
    setHistory([...history, `Delete from end: ${deletedValue}`]);
    showMessage(`Deleted ${deletedValue} from end`);
  };

  const deleteAtPosition = () => {
    const pos = parseInt(position);
    if (isNaN(pos) || pos < 0 || pos >= nodes.length) {
      showMessage(`Position must be between 0 and ${nodes.length - 1}`);
      return;
    }

    const deletedValue = nodes[pos].value;
    const newNodes = [...nodes];
    newNodes.splice(pos, 1);
    setNodes(newNodes);
    setHistory([...history, `Delete from position ${pos}: ${deletedValue}`]);
    setPosition('');
    showMessage(`Deleted ${deletedValue} from position ${pos}`);
  };

  const search = () => {
    if (!searchValue.trim()) {
      showMessage('Please enter a search value');
      return;
    }

    const index = nodes.findIndex(node => node.value === searchValue.trim());
    if (index !== -1) {
      setHighlightedIndex(index);
      showMessage(`Found "${searchValue}" at position ${index}`);
      setHistory([...history, `Search: Found "${searchValue}" at position ${index}`]);
      setTimeout(() => setHighlightedIndex(null), 3000);
    } else {
      showMessage(`"${searchValue}" not found in list`);
      setHistory([...history, `Search: "${searchValue}" not found`]);
    }
    setSearchValue('');
  };

  const reverse = () => {
    if (nodes.length === 0) {
      showMessage('List is empty!');
      return;
    }

    setNodes([...nodes].reverse());
    setHistory([...history, 'Reversed list']);
    showMessage('List reversed');
  };

  const clear = () => {
    setNodes([]);
    setHistory([]);
    setHighlightedIndex(null);
    showMessage('Cleared list');
  };

  const getSize = () => {
    showMessage(`List size: ${nodes.length}`);
    setHistory([...history, `Get size: ${nodes.length}`]);
  };

  const renderNode = (node, index) => {
    const isHighlighted = highlightedIndex === index;
    const isHead = index === 0;
    const isTail = index === nodes.length - 1;

    return (
      <div key={node.id} className="flex items-center">
        <div className="flex flex-col items-center">
          {isHead && (
            <div className="text-xs font-bold text-[#006989] mb-1">HEAD</div>
          )}
          <div
            className={`relative w-24 h-24 rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-lg transition-all duration-300 ${
              isHighlighted
                ? 'bg-yellow-500 scale-110'
                : 'bg-[#01A7C2]'
            }`}
          >
            <div className="text-xl">{node.value}</div>
            <div className="text-xs mt-1 opacity-75">pos: {index}</div>
            {listType === 'doubly' && index > 0 && (
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                <ArrowRight className="text-[#007090] rotate-180" size={20} />
              </div>
            )}
          </div>
          {isTail && (
            <div className="text-xs font-bold text-[#006989] mt-1">TAIL</div>
          )}
        </div>
        
        {index < nodes.length - 1 && (
          <div className="flex items-center mx-2">
            <ArrowRight className="text-[#007090]" size={28} />
          </div>
        )}
        
        {index === nodes.length - 1 && listType === 'circular' && nodes.length > 1 && (
          <div className="flex items-center mx-2">
            <div className="flex flex-col items-center">
              <div className="text-[#007090] text-sm font-semibold">↻</div>
              <div className="text-xs text-gray-500">circular</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#006989] mb-8 text-center">
          Linked List Visualizer
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#006989] mb-6">Controls</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    List Type
                  </label>
                  <select
                    value={listType}
                    onChange={(e) => {
                      setListType(e.target.value);
                      clear();
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090]"
                  >
                    <option value="singly">Singly Linked List</option>
                    <option value="doubly">Doubly Linked List</option>
                    <option value="circular">Circular Linked List</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Node Value
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') insertAtEnd();
                    }}
                    placeholder="Enter value..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090]"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">Insert Operations</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={insertAtBeginning}
                      disabled={nodes.length >= maxSize}
                      className="bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                    >
                      At Beginning
                    </button>
                    <button
                      onClick={insertAtEnd}
                      disabled={nodes.length >= maxSize}
                      className="bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                    >
                      At End
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Position"
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090] text-sm"
                    />
                    <button
                      onClick={insertAtPosition}
                      disabled={nodes.length >= maxSize}
                      className="bg-[#01A7C2] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                    >
                      Insert
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">Delete Operations</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={deleteFromBeginning}
                      disabled={nodes.length === 0}
                      className="bg-[#007090] hover:bg-[#006989] disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                    >
                      From Beginning
                    </button>
                    <button
                      onClick={deleteFromEnd}
                      disabled={nodes.length === 0}
                      className="bg-[#007090] hover:bg-[#006989] disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                    >
                      From End
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Position"
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090] text-sm"
                    />
                    <button
                      onClick={deleteAtPosition}
                      disabled={nodes.length === 0}
                      className="bg-[#007090] hover:bg-[#006989] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">Other Operations</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') search();
                      }}
                      placeholder="Search value..."
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007090] text-sm"
                    />
                    <button
                      onClick={search}
                      disabled={nodes.length === 0}
                      className="bg-[#A3BAC3] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center gap-1"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={reverse}
                      disabled={nodes.length === 0}
                      className="bg-[#A3BAC3] hover:bg-[#007090] disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                    >
                      Reverse
                    </button>
                    <button
                      onClick={getSize}
                      className="bg-[#A3BAC3] hover:bg-[#007090] text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                    >
                      Get Size
                    </button>
                  </div>
                </div>

                <button
                  onClick={clear}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear List
                </button>

                <div className="bg-[#EAEBED] rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Nodes: {nodes.length} / {maxSize}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {listType === 'singly' && 'Each node points to next'}
                    {listType === 'doubly' && 'Nodes point both ways'}
                    {listType === 'circular' && 'Last node points to first'}
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
              <div className="max-h-48 overflow-y-auto space-y-1">
                {history.length === 0 ? (
                  <p className="text-gray-400 text-sm">No operations yet</p>
                ) : (
                  history.slice(-8).reverse().map((op, idx) => (
                    <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                      {op}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#006989] mb-3">Time Complexity</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Insert/Delete at beginning:</strong> O(1)</p>
                <p><strong>Insert/Delete at end:</strong> O(n)</p>
                <p><strong>Search:</strong> O(n)</p>
                <p><strong>Access by index:</strong> O(n)</p>
                <p className="mt-3 pt-3 border-t text-xs text-gray-500">
                  {listType === 'doubly' 
                    ? 'Doubly linked lists use more memory but allow bidirectional traversal'
                    : listType === 'circular'
                    ? 'Circular lists are useful for round-robin scheduling'
                    : 'Singly linked lists use less memory per node'}
                </p>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <div className="flex items-center min-h-[500px] p-8">
                {nodes.length === 0 ? (
                  <div className="w-full text-center">
                    <div className="text-gray-400 text-lg mb-4">List is empty</div>
                    <div className="text-gray-500 text-sm">
                      Add nodes using the controls on the left
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    {nodes.map((node, index) => renderNode(node, index))}
                    {listType !== 'circular' && (
                      <div className="ml-4 text-gray-400 font-bold text-2xl">∅</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkedListVisualizer;