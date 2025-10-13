import React, { useState} from 'react';
import { Menu, X, } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import SortingVisualizer from './components/SortingVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import Home from './components/Home';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition ${currentPage === 'home'
                    ? 'text-[#006989] bg-[#A3BAC3]/30'
                    : 'text-gray-700 hover:text-[#006989]'
                  }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('sorting')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition ${currentPage === 'sorting'
                    ? 'text-[#006989] bg-[#A3BAC3]/30'
                    : 'text-gray-700 hover:text-[#006989]'
                  }`}
              >
                Sorting Algorithms
              </button>
              <button
                onClick={() => setCurrentPage('graphs')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition ${currentPage === 'graphs'
                    ? 'text-[#006989] bg-[#A3BAC3]/30'
                    : 'text-gray-700 hover:text-[#006989]'
                  }`}
              >
                Graph Algorithms
              </button>
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
              <button
                onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Home
              </button>
              <button
                onClick={() => { setCurrentPage('sorting'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Sorting Algorithms
              </button>
              <button
                onClick={() => { setCurrentPage('graphs'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Graph Algorithms
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'sorting' && <SortingVisualizer />}
        {currentPage === 'graphs' && <GraphVisualizer />}
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
  );
}

export default App;