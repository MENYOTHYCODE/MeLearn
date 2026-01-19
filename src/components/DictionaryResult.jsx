import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiVolume2, FiCopy, FiCheck, FiMessageCircle, FiBook, FiTarget } from 'react-icons/fi';
import noteService from '../services/noteService';
import { useNotification } from '../context/NotificationContext';

const DictionaryResult = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { showSuccess, showError } = useNotification();


  const saveToNotes = () => {
    const comprehensiveContent = generateComprehensiveContent(result);
    const created = noteService.addNote({
      title: `Word: ${result.word}`,
      content: comprehensiveContent,
      category: 'Dictionary'
    });
    if (created) {
      showSuccess('Saved', 'Comprehensive word definition saved to Notes!');
    } else {
      showError('Save failed', 'Could not save the word to Notes.');
    }
  };

  const generateComprehensiveContent = (result) => {
    const phonetic = result.phonetics?.find(p => p.text)?.text || result.phonetic || '';
    
    let content = `# ${result.word.toUpperCase()}\n\n`;
    
    if (phonetic) {
      content += `**Pronunciation:** ${phonetic}\n\n`;
    }
    
    content += `## 📖 Complete Definition Guide\n\n`;
    
    result.meanings?.forEach((meaning, index) => {
      content += `### ${index + 1}. ${meaning.partOfSpeech.toUpperCase()}\n\n`;
      
      meaning.definitions?.forEach((def, defIndex) => {
        content += `**Definition ${defIndex + 1}:** ${def.definition}\n\n`;
        
        if (def.example) {
          content += `*Example:* "${def.example}"\n\n`;
        }
        
        // Add custom examples
        const customExamples = generateCustomExamples(result.word, meaning.partOfSpeech, def.definition);
        if (customExamples.length > 0) {
          content += `*Additional Examples:*\n${customExamples.map(ex => `• ${ex}`).join('\n')}\n\n`;
        }
      });
      
      if (meaning.synonyms && meaning.synonyms.length > 0) {
        content += `**Synonyms:** ${meaning.synonyms.slice(0, 5).join(', ')}\n\n`;
      }
      
      if (meaning.antonyms && meaning.antonyms.length > 0) {
        content += `**Antonyms:** ${meaning.antonyms.slice(0, 5).join(', ')}\n\n`;
      }
    });
    
    content += `## 💡 Usage Tips\n\n`;
    content += `• Use "${result.word}" in ${getUsageContext(result.meanings[0]?.partOfSpeech)}\n`;
    content += `• Remember the pronunciation: ${phonetic}\n`;
    content += `• Practice using this word in your own sentences\n\n`;
    
    content += `---\n*Saved from Dictionary on ${new Date().toLocaleDateString()}*`;
    
    return content;
  };

  const generateCustomExamples = (word, partOfSpeech, definition) => {
    const examples = [];
    const lowerWord = word.toLowerCase();
    
    // Generate contextual examples based on part of speech
    switch (partOfSpeech) {
      case 'noun':
        examples.push(`The ${lowerWord} was clearly visible from here.`);
        examples.push(`She studied the ${lowerWord} carefully.`);
        break;
      case 'verb':
        examples.push(`They ${lowerWord} every morning.`);
        examples.push(`I will ${lowerWord} this tomorrow.`);
        break;
      case 'adjective':
        examples.push(`The situation was quite ${lowerWord}.`);
        examples.push(`She felt ${lowerWord} about the decision.`);
        break;
      case 'adverb':
        examples.push(`He spoke ${lowerWord} to the audience.`);
        examples.push(`The task was completed ${lowerWord}.`);
        break;
      default:
        examples.push(`The word "${lowerWord}" is commonly used in this context.`);
    }
    
    return examples.slice(0, 2);
  };

  const getUsageContext = (partOfSpeech) => {
    switch (partOfSpeech) {
      case 'noun': return 'sentences as a subject or object';
      case 'verb': return 'sentences to describe actions';
      case 'adjective': return 'sentences to describe nouns';
      case 'adverb': return 'sentences to modify verbs or adjectives';
      default: return 'appropriate contexts';
    }
  };

  const copyDefinition = async () => {
    const text = `${result.word}: ${result.meanings[0]?.definitions[0]?.definition || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const playAudio = () => {
    const audioUrl = result.phonetics?.find(p => p.audio)?.audio;
    if (audioUrl) {
      setAudioPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => setAudioPlaying(false);
      audio.play().catch(() => setAudioPlaying(false));
    }
  };

  const hasAudio = result.phonetics?.some(p => p.audio);
  const phonetic = result.phonetics?.find(p => p.text)?.text || result.phonetic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
    >
      {/* Enhanced Word Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                {result.word}
              </h2>
              {hasAudio && (
                <button
                  onClick={playAudio}
                  disabled={audioPlaying}
                  className="p-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-full shadow-sm transition-colors disabled:opacity-50"
                  title="Play pronunciation"
                >
                  <FiVolume2 className={`w-6 h-6 ${audioPlaying ? 'animate-pulse' : ''}`} />
                </button>
              )}
            </div>
            {phonetic && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-200">Pronunciation:</span>
                <span className="text-lg font-mono text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-lg">
                  {phonetic}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={copyDefinition}
              className="p-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm"
              title="Copy definition"
            >
              {copied ? (
                <FiCheck className="w-5 h-5 text-green-600" />
              ) : (
                <FiCopy className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={saveToNotes}
              className="p-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm"
              title="Save comprehensive definition to Notes"
            >
              <FiBookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Comprehensive Meanings */}
        <div className="space-y-8">
          {result.meanings?.map((meaning, meaningIndex) => (
            <motion.div 
              key={meaningIndex} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: meaningIndex * 0.1 }}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700"
            >
              {/* Part of Speech Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                  <FiBook className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-blue-800 dark:text-blue-300 capitalize text-lg">
                    {meaning.partOfSpeech}
                  </span>
                </div>
              </div>
              
              {/* Definitions with Enhanced Examples */}
              <div className="space-y-6">
                {meaning.definitions?.slice(0, 3).map((definition, defIndex) => (
                  <div key={defIndex} className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-600">
                    {/* Definition */}
                    <div className="mb-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {defIndex + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Definition</h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {definition.definition}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Examples Section */}
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiMessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Example Sentences
                      </h5>
                      
                      <div className="space-y-3">
                        {/* Original Example */}
                        {definition.example && (
                          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-3 rounded-r-lg">
                            <p className="text-gray-700 dark:text-gray-300 italic">
                              "{definition.example}"
                            </p>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Dictionary Example</span>
                          </div>
                        )}
                        
                        {/* Custom Generated Examples */}
                        {generateCustomExamples(result.word, meaning.partOfSpeech, definition.definition).map((example, exIndex) => (
                          <div key={exIndex} className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-3 rounded-r-lg">
                            <p className="text-gray-700 dark:text-gray-300 italic">
                              "{example}"
                            </p>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Practice Example</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Usage Tips */}
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h6 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1 flex items-center gap-1">
                        <FiTarget className="w-4 h-4" />
                        Usage Tip
                      </h6>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        Use "{result.word}" {getUsageContext(meaning.partOfSpeech)}. 
                        {meaning.partOfSpeech === 'verb' && ' Remember to conjugate it properly based on tense.'}
                        {meaning.partOfSpeech === 'noun' && ' It can be used as both singular and plural (check context).'}
                        {meaning.partOfSpeech === 'adjective' && ' Place it before the noun it describes.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Word Relationships */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Synonyms */}
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h6 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      ✅ Similar Words (Synonyms)
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      {meaning.synonyms.slice(0, 6).map((synonym, synIndex) => (
                        <span key={synIndex} className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Antonyms */}
                {meaning.antonyms && meaning.antonyms.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h6 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                      ❌ Opposite Words (Antonyms)
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      {meaning.antonyms.slice(0, 6).map((antonym, antIndex) => (
                        <span key={antIndex} className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                          {antonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Learning Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <h4 className="text-lg font-bold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
            🎯 Quick Learning Summary
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-purple-700 dark:text-purple-300">
              <strong>Word:</strong> {result.word} {phonetic && `(${phonetic})`}
            </p>
            <p className="text-purple-700 dark:text-purple-300">
              <strong>Main uses:</strong> {result.meanings?.map(m => m.partOfSpeech).join(', ')}
            </p>
            <p className="text-purple-700 dark:text-purple-300">
              <strong>Remember:</strong> Practice using this word in your own sentences to master it!
            </p>
          </div>
        </div>

        {/* Source */}
        {result.sourceUrls && result.sourceUrls.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-200 flex items-center gap-2">
              <FiBook className="w-3 h-3" />
              Source:{' '}
              <a
                href={result.sourceUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {new URL(result.sourceUrls[0]).hostname}
              </a>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DictionaryResult;