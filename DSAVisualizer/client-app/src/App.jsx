import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SortingVisualizer from './components/SortingVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import Home from './components/Home';
import TreeVisualizer from './components/TreeVisualizer';
import StackQueueVisualizer from './components/StackQueueVisualizer';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#EAEBED] to-[#A3BAC3] flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-[#006989]">DSA Visualizer</h1>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                <Link
                  to="/" // Home link now uses React Router
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition ${window.location.pathname === '/' ? 'text-[#006989] bg-[#A3BAC3]/30' : 'text-gray-700 hover:text-[#006989]'}`}
                >
                  Home
                </Link>
                <Link
                  to="/sorting" // Sorting link uses React Router
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition ${window.location.pathname === '/sorting' ? 'text-[#006989] bg-[#A3BAC3]/30' : 'text-gray-700 hover:text-[#006989]'}`}
                >
                  Sorting Algorithms
                </Link>
                <Link
                  to="/graphs" // Graph link uses React Router
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition ${window.location.pathname === '/graphs' ? 'text-[#006989] bg-[#A3BAC3]/30' : 'text-gray-700 hover:text-[#006989]'}`}
                >
                  Graph Algorithms
                </Link>
                <Link
                  to="/trees" // Trees link uses React Router
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition ${window.location.pathname === '/trees' ? 'text-[#006989] bg-[#A3BAC3]/30' : 'text-gray-700 hover:text-[#006989]'}`}
                >
                  Tree Algorithms
                </Link>
                <Link
                  to="/stacks-queues"
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition ${window.location.pathname === '/stacks-queues' ? 'text-[#006989] bg-[#A3BAC3]/30' : 'text-gray-700 hover:text-[#006989]'}`}
                >
                  Stacks & Queues
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/" // Home link for mobile menu
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Home
                </Link>
                <Link
                  to="/sorting" // Sorting link for mobile menu
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sorting Algorithms
                </Link>
                <Link
                  to="/graphs" // Graph link for mobile menu
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Graph Algorithms
                </Link>
                <Link
                  to="/trees" // Tree link for mobile menu
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Tree Algorithms
                </Link>
                <Link
                  to="/stacks-queues" // StackQueues link for mobile menu
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Stacks & Queues
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sorting" element={<SortingVisualizer />} />
            <Route path="/graphs" element={<GraphVisualizer />} />
            <Route path="/trees" element={<TreeVisualizer />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-[#006989] text-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">{new Date().getFullYear()} © KD Medina</p>
            <div className="flex gap-6">
              <a
                href="https://github.com/KDTMedina"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-[#01A7C2] hover:text-white transition"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com/in/kdtmedina"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#01A7C2] hover:text-white transition"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
