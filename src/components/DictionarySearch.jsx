import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiLoader, FiBookOpen } from 'react-icons/fi';
import DictionaryResult from './DictionaryResult';

const DictionarySearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('dictionaryHistory') || '[]');
  });

  const searchWord = async (word) => {
    if (!word.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`
      );

      if (!response.ok) {
        throw new Error('Word not found');
      }

      const data = await response.json();
      setResults(data[0]); // Take the first result

      // Add to search history
      const newHistory = [word.toLowerCase(), ...searchHistory.filter(h => h !== word.toLowerCase())].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('dictionaryHistory', JSON.stringify(newHistory));

    } catch (err) {
      setError(`Sorry, we couldn't find the word "${word}". Please check the spelling and try again.`);
      console.error('Dictionary search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchWord(query);
  };

  const handleHistoryClick = (word) => {
    setQuery(word);
    searchWord(word);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('dictionaryHistory');
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Look up any word..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              Looking up...
            </>
          ) : (
            <>
              <FiSearch className="w-4 h-4" />
              Look Up Word
            </>
          )}
        </button>
      </form>

      {/* Search History */}
      {searchHistory.length > 0 && !results && !loading && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Recent Searches
            </h3>
            <button
              onClick={clearHistory}
              className="text-xs text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((word, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(word)}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DictionaryResult result={results} />
        </motion.div>
      )}

      {/* Empty State */}
      {!results && !loading && !error && (
        <div className="text-center py-12">
          <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Dictionary Lookup
          </h3>
          <p className="text-gray-600 dark:text-gray-200 text-sm">
            Get definitions, pronunciations, and examples for any word
          </p>
        </div>
      )}
    </div>
  );
};

export default DictionarySearch;