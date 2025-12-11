import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiBookmark, FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

const TopicResultCard = ({ title, summary, keyPoints, url }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const saveToNotes = () => {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const enhancedContent = generateEnhancedContent(title, summary, keyPoints);
    const newNote = {
      id: Date.now(),
      title: `Topic: ${title}`,
      content: enhancedContent,
      date: new Date().toISOString(),
      category: 'Quick Access'
    };
    
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    
    alert('Comprehensive topic summary saved to Notes!');
  };

  const generateEnhancedContent = (title, summary, keyPoints) => {
    return `# ${title}

## 📖 Comprehensive Summary

${summary}

## 🔑 Key Learning Points

${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n\n')}

## 💡 Study Tips for ${title}

• Break down complex concepts into smaller, manageable parts
• Create visual diagrams or mind maps to understand relationships
• Practice explaining the concept in your own words
• Look for real-world applications and examples
• Review regularly to reinforce understanding

## 📚 Further Study Recommendations

• Explore related subtopics to deepen understanding
• Find practice problems or exercises
• Connect this topic to other subjects you're studying
• Discuss with study groups or teachers for different perspectives

---
*Saved from Quick Access Panel on ${new Date().toLocaleDateString()}*`;
  };

  const getTopicCategory = (title) => {
    const scienceKeywords = ['biology', 'chemistry', 'physics', 'science', 'cell', 'atom', 'molecule', 'photosynthesis', 'evolution'];
    const mathKeywords = ['math', 'calculus', 'algebra', 'geometry', 'equation', 'theorem', 'formula'];
    const historyKeywords = ['history', 'war', 'revolution', 'empire', 'civilization', 'ancient', 'medieval'];
    const literatureKeywords = ['literature', 'novel', 'poem', 'author', 'shakespeare', 'poetry'];
    
    const lowerTitle = title.toLowerCase();
    
    if (scienceKeywords.some(keyword => lowerTitle.includes(keyword))) return { category: 'Science', icon: '🔬', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (mathKeywords.some(keyword => lowerTitle.includes(keyword))) return { category: 'Mathematics', icon: '📐', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (historyKeywords.some(keyword => lowerTitle.includes(keyword))) return { category: 'History', icon: '🏛️', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    if (literatureKeywords.some(keyword => lowerTitle.includes(keyword))) return { category: 'Literature', icon: '📚', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
    
    return { category: 'General', icon: '📖', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
  };

  const topicInfo = getTopicCategory(title);
  const shouldTruncate = summary && summary.length > 300;
  const displaySummary = shouldTruncate && !isExpanded ? summary.substring(0, 300) + '...' : summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
    >
      {/* Header with Category Badge */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${topicInfo.color}`}>
                <span>{topicInfo.icon}</span>
                {topicInfo.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveToNotes}
              className="p-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm"
              title="Save comprehensive summary to Notes"
            >
              <FiBookmark className="w-5 h-5" />
            </button>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm"
                title="Read full article on Wikipedia"
              >
                <FiExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Comprehensive Summary Section */}
        {summary && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Understanding {title}
              </h3>
            </div>
            
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {displaySummary}
              </p>
              
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <FiChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="w-4 h-4" />
                      Read Full Summary
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Key Learning Points */}
        {keyPoints && keyPoints.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              🔑 Key Learning Points
            </h4>
            <div className="space-y-3">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why This Matters Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            💡 Why This Matters
          </h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Understanding <strong>{title}</strong> is essential for building a solid foundation in {topicInfo.category.toLowerCase()}. 
            This concept connects to many other topics and has practical applications in real-world scenarios. 
            Mastering this will help you tackle more advanced concepts with confidence.
          </p>
        </div>

        {/* Additional Resources Section */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            📚 Explore Further
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
              >
                <FiExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Complete Article</span>
              </a>
            )}
            
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' explained')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
            >
              <span className="text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">🎥</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Tutorials</span>
            </a>
            
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(title + ' practice problems exercises')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
            >
              <span className="text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">✏️</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Practice Problems</span>
            </a>
            
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(title + ' related topics concepts')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
            >
              <span className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">🔗</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Related Topics</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopicResultCard;