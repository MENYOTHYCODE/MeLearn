import { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const QuoteCard = () => {
  const [quote, setQuote] = useState({ content: '', author: '' });
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      // Try the Quotable API first
      const response = await axios.get('https://api.quotable.io/random', {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.data && response.data.content) {
        setQuote({
          content: response.data.content,
          author: response.data.author || 'Unknown'
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback to local educational quotes
      const educationalQuotes = [
        {
          content: 'Education is the most powerful weapon which you can use to change the world.',
          author: 'Nelson Mandela'
        },
        {
          content: 'The beautiful thing about learning is that no one can take it away from you.',
          author: 'B.B. King'
        },
        {
          content: 'Learning never exhausts the mind.',
          author: 'Leonardo da Vinci'
        },
        {
          content: 'The only way to do great work is to love what you do.',
          author: 'Steve Jobs'
        },
        {
          content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
          author: 'Winston Churchill'
        },
        {
          content: 'The expert in anything was once a beginner.',
          author: 'Helen Hayes'
        },
        {
          content: 'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.',
          author: 'Richard Feynman'
        }
      ];
      
      const randomQuote = educationalQuotes[Math.floor(Math.random() * educationalQuotes.length)];
      setQuote(randomQuote);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to fetch quote, but don't wait for it
    fetchQuote();
    
    // Also set a fallback quote immediately so users see something
    if (!quote.content) {
      const fallbackQuotes = [
        {
          content: 'Education is the most powerful weapon which you can use to change the world.',
          author: 'Nelson Mandela'
        },
        {
          content: 'The beautiful thing about learning is that no one can take it away from you.',
          author: 'B.B. King'
        },
        {
          content: 'Learning never exhausts the mind.',
          author: 'Leonardo da Vinci'
        }
      ];
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
    }
  }, []);

  return (
    <div className="card bg-linear-to-br from-blue-500 to-purple-600 text-white">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">💡 Daily Inspiration</h3>
        <button
          onClick={fetchQuote}
          disabled={loading}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <blockquote className="text-lg italic mb-3">
        "{quote.content}"
      </blockquote>
      
      <p className="text-sm text-white/80">— {quote.author}</p>
    </div>
  );
};

export default QuoteCard;
