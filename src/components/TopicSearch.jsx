import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiLoader } from 'react-icons/fi';
import TopicResultCard from './TopicResultCard';
import BookCard from './BookCard';
import VideoCard from './VideoCard';

const TopicSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTopic = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Fetch Wikipedia summary
      const wikiResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`
      );
      
      let wikiData = null;
      if (wikiResponse.ok) {
        const rawWikiData = await wikiResponse.json();
        wikiData = enhanceWikipediaContent(rawWikiData);
      }

      // Fetch Google Books (using a CORS proxy for demo)
      let booksData = [];
      try {
        const booksResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=3`
        );
        if (booksResponse.ok) {
          const books = await booksResponse.json();
          booksData = books.items || [];
        }
      } catch (err) {
        console.log('Books API error:', err);
      }

      // For YouTube, we'll use a mock response since YouTube API requires API key
      const mockVideos = [
        {
          id: '1',
          title: `${searchQuery} - Complete Guide`,
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
        },
        {
          id: '2',
          title: `Learn ${searchQuery} in 10 Minutes`,
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' tutorial')}`
        },
        {
          id: '3',
          title: `${searchQuery} Explained Simply`,
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' explained')}`
        }
      ];

      setResults({
        topic: searchQuery,
        wikipedia: wikiData,
        books: booksData,
        videos: mockVideos
      });

    } catch (err) {
      setError('Failed to fetch topic information. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchTopic(query);
  };

  const extractKeyPoints = (text) => {
    if (!text) return [];
    
    // Enhanced extraction - split by sentences and filter for educational content
    const sentences = text.split(/[.!?]+/).filter(s => {
      const trimmed = s.trim();
      return trimmed.length > 30 && 
             !trimmed.toLowerCase().includes('wikipedia') &&
             !trimmed.toLowerCase().includes('citation needed') &&
             trimmed.includes(' ');
    });
    
    // Take the most informative sentences
    return sentences.slice(0, 5).map(s => {
      let cleaned = s.trim();
      // Remove any remaining wiki markup
      cleaned = cleaned.replace(/\[\d+\]/g, '');
      cleaned = cleaned.replace(/\([^)]*\)/g, '');
      return cleaned;
    }).filter(s => s.length > 20);
  };

  const enhanceWikipediaContent = (wikiData) => {
    if (!wikiData) return null;
    
    // Create a more comprehensive summary
    let enhancedSummary = wikiData.extract;
    
    // Add context about why this topic matters
    const topicImportance = generateTopicImportance(wikiData.title);
    if (topicImportance) {
      enhancedSummary += `\n\n${topicImportance}`;
    }
    
    return {
      ...wikiData,
      extract: enhancedSummary,
      enhanced: true
    };
  };

  const generateTopicImportance = (title) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('math') || lowerTitle.includes('calculus') || lowerTitle.includes('algebra')) {
      return "This mathematical concept is fundamental for problem-solving and logical thinking. Understanding it will help you tackle more complex mathematical challenges and develop analytical skills useful in many fields.";
    }
    
    if (lowerTitle.includes('biology') || lowerTitle.includes('cell') || lowerTitle.includes('evolution')) {
      return "This biological concept helps us understand life processes and how living organisms function. It's essential for comprehending health, medicine, and our relationship with the natural world.";
    }
    
    if (lowerTitle.includes('history') || lowerTitle.includes('war') || lowerTitle.includes('revolution')) {
      return "Understanding this historical topic provides insight into how past events shape our present world. It helps develop critical thinking about cause and effect in human societies.";
    }
    
    if (lowerTitle.includes('physics') || lowerTitle.includes('energy') || lowerTitle.includes('force')) {
      return "This physics concept explains how the physical world works around us. Mastering it provides a foundation for understanding technology, engineering, and natural phenomena.";
    }
    
    return "This topic provides valuable knowledge that connects to many other areas of study. Understanding it will broaden your perspective and enhance your overall education.";
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
            placeholder="Search any topic (e.g., photosynthesis, calculus, history...)"
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
              Searching...
            </>
          ) : (
            <>
              <FiSearch className="w-4 h-4" />
              Search Topic
            </>
          )}
        </button>
      </form>

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
          className="space-y-6"
        >
          {/* Topic Summary */}
          {results.wikipedia && (
            <TopicResultCard
              title={results.wikipedia.title}
              summary={results.wikipedia.extract}
              keyPoints={extractKeyPoints(results.wikipedia.extract)}
              url={results.wikipedia.content_urls?.desktop?.page}
            />
          )}

          {/* Books Section */}
          {results.books.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                📚 Related Books
              </h3>
              <div className="space-y-3">
                {results.books.slice(0, 3).map((book, index) => (
                  <BookCard key={index} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              🎥 Study Videos
            </h3>
            <div className="space-y-3">
              {results.videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!results && !loading && !error && (
        <div className="text-center py-12">
          <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Search Any Topic
          </h3>
          <p className="text-gray-600 dark:text-gray-200 text-sm">
            Get instant information, related books, and study videos for any subject
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicSearch;