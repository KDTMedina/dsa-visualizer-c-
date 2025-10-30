import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#006989] mb-4">
          Data Structures & Algorithms Visualizer
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Interactive visualization of sorting algorithms, graph algorithms, and data structures
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#006989] mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#01A7C2] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Algorithm</h3>
            <p className="text-gray-600">Select from various sorting or graph algorithms</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#007090] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Configure Input</h3>
            <p className="text-gray-600">Enter your data or generate random inputs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#006989] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Visualize</h3>
            <p className="text-gray-600">Watch the algorithm execute step-by-step</p>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
          <h2 className="text-3xl mb-4">🔢 Sorting Algorithms</h2>
          <p className="text-gray-600 mb-4">Visualize popular sorting algorithms step-by-step</p>
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Bubble Sort
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Selection Sort
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Insertion Sort
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Merge Sort
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Quick Sort
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Heap Sort
            </li>
          </ul>
          <Link
            to="/sorting" // Updated to use React Router's Link
            className="w-full bg-[#007090] hover:bg-[#006989] text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Explore Sorting
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
          <h2 className="text-3xl mb-4">🕸️ Graph Algorithms</h2>
          <p className="text-gray-600 mb-4">Understand graph traversal and pathfinding algorithms</p>
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Breadth-First Search
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Depth-First Search
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Dijkstra's Shortest Path
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Prim's MST
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Topological Sort
            </li>
          </ul>
          <Link
            to="/graphs" // Updated to use React Router's Link
            className="w-full bg-[#007090] hover:bg-[#006989] text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Explore Graphs
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
          <h2 className="text-3xl mb-4">🌲 Tree Algorithms</h2>
          <p className="text-gray-600 mb-4">Explore fundamental tree algorithms and binary search tree operations</p>
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              In-Order Traversal
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Pre-Order Traversal
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Post-Order Traversal
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Level-Order Traversal
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              BST Search
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              BST Insert
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              BST Delete
            </li>
          </ul>
          <Link
            to="/trees" // Updated to use React Router's Link
            className="w-full bg-[#007090] hover:bg-[#006989] text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Explore Trees
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
          <h2 className="text-3xl mb-4">📚 Stacks & Queues</h2>
          <p className="text-gray-600 mb-4">Visualize LIFO and FIFO data structures in action</p>
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Stack (LIFO)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Queue (FIFO)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Priority Queue
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Push/Pop Operations
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Enqueue/Dequeue
            </li>
          </ul>
          <Link
            to="/stacks-queues"
            className="w-full bg-[#007090] hover:bg-[#006989] text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Explore Stacks & Queues
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
          <h2 className="text-3xl mb-4">🔗 Linked Lists</h2>
          <p className="text-gray-600 mb-4">Visualize dynamic linear data structures with pointer-based connections</p>
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Singly Linked List
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Doubly Linked List
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Circular Linked List
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Insert/Delete Operations
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#01A7C2] rounded-full"></span>
              Search & Reverse
            </li>
          </ul>
          <Link
            to="/linked-lists"
            className="w-full bg-[#007090] hover:bg-[#006989] text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Explore Linked Lists
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
