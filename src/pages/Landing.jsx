import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCheckSquare, FiFileText, FiClock, FiTrendingUp, FiBook, 
  FiTarget, FiZap, FiShield, FiStar, FiPlay,
  FiBookOpen, FiVideo, FiGlobe, FiMessageCircle,
  FiChevronDown, FiChevronUp, FiArrowRight, FiHeart,
  FiGithub, FiTwitter, FiMail, FiCheck, FiUser, FiAward
} from 'react-icons/fi';
import axios from 'axios';
import LandingNavbar from '../components/LandingNavbar';
import MLLogo from '../components/MLLogo';

const Landing = () => {
  const [quote, setQuote] = useState({ content: '', author: '' });
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    // Fetch motivational quote
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.quotable.io/random?tags=motivational');
        setQuote({ content: response.data.content, author: response.data.author });
      } catch (error) {
        setQuote({ 
          content: 'The only way to do great work is to love what you do.', 
          author: 'Steve Jobs' 
        });
      }
    };
    fetchQuote();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1277C9] to-[#0F4C5C] ">
      
      {/* Navigation */}
      <LandingNavbar />
      
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Floating Tags */}
            <motion.div 
              className="flex justify-center gap-4 mb-8"
              variants={fadeInUp}
            >
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
                100% Personal
              </span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium">
                AI-Assisted Resources
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-500 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Your Personal Digital Study Companion
            </motion.h1>
            
            <motion.p 
              className="text-xl font-bold md:text-2xl text-gray-900 dark:text-gray-300 mb-4"
              variants={fadeInUp}
            >
              Study smarter. Stay organized. Track your growth.
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-100 dark:text-gray-200 mb-12 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Transform your learning journey with intelligent task management, focus tools, progress tracking, and instant access to educational resources.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                Get Started <FiArrowRight />
              </Link>
              <Link
                to="/learn-more"
                className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-600 hover:text-white transition-all inline-flex items-center gap-2 justify-center"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Hero Illustration Placeholder */}
            <motion.div 
              className="mt-16 relative"
              variants={fadeInUp}
            >
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
                <div className="text-6xl mb-4">🧠📚✨</div>
                <p className="text-gray-600 dark:text-gray-200">Modern Study Dashboard Preview</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why MeLearn Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose MeLearn?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto">
              Stop juggling multiple apps and scattered notes. MeLearn brings everything together in one beautiful, intelligent platform.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: FiTarget,
                title: 'Stay Organized',
                description: 'Manage tasks & notes effortlessly with smart categorization and filtering.'
              },
              {
                icon: FiUser,
                title: 'Study Smarter',
                description: 'Pomodoro timer, weekly goals, and detailed analytics to optimize your learning.'
              },
              {
                icon: FiZap,
                title: 'Learn Faster',
                description: 'Instant access to books, videos, dictionary, and topic summaries.'
              },
              {
                icon: FiShield,
                title: 'Zero Distractions',
                description: 'Deep focus mode with fullscreen timer and ambient sounds.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">{item.title}</h3>
                <p className="text-gray-600 dark:text-white">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Features Preview */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">Powerful Features for Modern Students</h2>
            <p className="text-xl text-gray-600 dark:text-white max-w-3xl mx-auto">
              Every tool you need to excel in your studies, designed with simplicity and effectiveness in mind.
            </p>
          </motion.div>

          <div className="space-y-20">
            {[
              {
                title: 'Smart Dashboard Overview',
                description: 'Get a complete view of your study progress with beautiful charts, daily stats, and motivational insights.',
                features: ['Daily study time tracking', 'Task completion rates', 'Weekly progress charts', 'Motivational quotes'],
                image: '📊',
                reverse: false
              },
              {
                title: 'Intelligent Study Planner',
                description: 'Organize your tasks by subject, set due dates, and track completion with our intuitive task management system.',
                features: ['Subject-based organization', 'Due date reminders', 'Progress filtering', 'Color-coded priorities'],
                image: '✅',
                reverse: true
              },
              {
                title: 'Smart Notes Workspace',
                description: 'Create, organize, and search through your notes with color coding and instant search functionality.',
                features: ['Color-coded organization', 'Instant search', 'Auto-save', 'Rich text support'],
                image: '📝',
                reverse: false
              },
              {
                title: 'Focus Mode & Pomodoro Timer',
                description: 'Enter deep focus with our distraction-free environment and customizable Pomodoro timer.',
                features: ['Customizable work/break intervals', 'Fullscreen mode', 'Browser notifications', 'Session tracking'],
                image: '⏰',
                reverse: true
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-6">{feature.title}</h3>
                  <p className="text-lg text-gray-600 dark:text-white mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <FiCheck className="w-5 h-5 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl p-12 text-center">
                    <div className="text-8xl mb-4">{feature.image}</div>
                    <p className="text-gray-600 dark:text-gray-200">Feature Preview</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Preview Cards */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">See MeLearn in Action</h2>
            <p className="text-xl text-gray-600 dark:text-gray-100">
              Professional screenshots of the actual application interface
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { title: 'Dashboard', icon: '📊', desc: 'Complete study overview' },
              { title: 'Study Planner', icon: '✅', desc: 'Task management' },
              { title: 'Notes Editor', icon: '📝', desc: 'Smart note taking' },
              { title: 'Pomodoro Timer', icon: '⏰', desc: 'Focus sessions' },
              { title: 'Resource Search', icon: '🔍', desc: 'Find study materials' },
              { title: 'Progress Tracking', icon: '📈', desc: 'Monitor growth' }
            ].map((screen, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-6xl">{screen.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{screen.title}</h3>
                  <p className="text-gray-600 dark:text-gray-200">{screen.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* API-Powered Smart Learning */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">AI-Powered Learning Resources</h2>
            <p className="text-xl text-gray-600 dark:text-white max-w-3xl mx-auto">
              Access millions of educational resources instantly with our integrated API connections
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: FiBookOpen,
                title: 'Google Books API',
                description: 'Search millions of books instantly',
                example: 'Find "Calculus textbooks" → Get 1000+ results'
              },
              {
                icon: FiVideo,
                title: 'YouTube API',
                description: 'Educational video search',
                example: 'Search "Physics tutorials" → Curated videos'
              },
              {
                icon: FiStar,
                title: 'Quotable API',
                description: 'Daily motivational quotes',
                example: 'Get inspired with wisdom from great minds'
              },
              {
                icon: FiMessageCircle,
                title: 'Dictionary API',
                description: 'Meanings & pronunciations',
                example: 'Look up "serendipity" → Full definition'
              },
              {
                icon: FiGlobe,
                title: 'Wikipedia API',
                description: 'Topic explanations',
                example: 'Learn about "Quantum Physics" → Summary'
              },
              {
                icon: FiAward,
                title: 'Smart Integration',
                description: 'All APIs work together',
                example: 'Seamless learning experience'
              }
            ].map((api, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                variants={fadeInUp}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <api.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{api.title}</h3>
                <p className="text-gray-600 dark:text-gray-200 text-sm mb-3">{api.description}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  {api.example}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits for Students */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">Transform Your Study Habits</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Join thousands of students who have revolutionized their learning with MeLearn
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: '🎯', title: 'Build Consistent Study Habits', desc: 'Daily tracking and streaks' },
              { icon: '📈', title: 'Track Learning Progress', desc: 'Visual charts and analytics' },
              { icon: '💪', title: 'Stay Motivated Daily', desc: 'Quotes and achievements' },
              { icon: '⚡', title: 'Quick Access to Resources', desc: 'Everything in one place' },
              { icon: '🧘', title: 'Improve Focus', desc: 'Pomodoro and distraction-free mode' },
              { icon: '🗂️', title: 'Organize Study Life', desc: 'Smart categorization system' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                variants={fadeInUp}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="opacity-90">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">What Students Say</h2>
            <p className="text-xl text-gray-600 dark:text-white">
              Real feedback from students using MeLearn
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                name: 'Sarah Chen',
                role: 'Computer Science Student',
                comment: 'MeLearn changed how I study. My productivity doubled and I finally feel organized!',
                avatar: '👩‍💻'
              },
              {
                name: 'Marcus Johnson',
                role: 'Medical Student',
                comment: 'The Pomodoro timer and resource search saved me countless hours. Absolutely love it!',
                avatar: '👨‍⚕️'
              },
              {
                name: 'Emma Rodriguez',
                role: 'Engineering Student',
                comment: 'Finally, all my study tools in one place. The progress tracking keeps me motivated daily.',
                avatar: '👩‍🔬'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-200">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.comment}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-white">
              Get started in just 3 simple steps
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                step: '01',
                title: 'Set Your Study Goals',
                description: 'Define your daily, weekly, and monthly study targets',
                icon: '🎯'
              },
              {
                step: '02',
                title: 'Organize Your Tasks & Notes',
                description: 'Add tasks, create notes, and organize by subjects',
                icon: '📝'
              },
              {
                step: '03',
                title: 'Start Learning & Track Progress',
                description: 'Use focus mode, track time, and monitor your growth',
                icon: '📈'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                variants={fadeInUp}
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-white">{step.description}</p>
                {index < 2 && (
                  <FiArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-gray-400" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-white">
              Everything you need to excel in your studies, completely free
            </p>
          </motion.div>

          <motion.div 
            className="max-w-lg mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-4 border-blue-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <p className="text-gray-600 dark:text-gray-200 mb-4">Forever</p>
                <div className="text-5xl font-bold text-blue-600 mb-2">$0</div>
                <p className="text-gray-600 dark:text-gray-400">No credit card required</p>
              </div>
              
              <ul className="space-y-4 mb-8 text-black">
                {[
                  'Unlimited tasks',
                  'Unlimited notes',
                  'Book & video search',
                  'Pomodoro timer',
                  'Study streaks',
                  'Progress tracking',
                  'Dark mode',
                  'Mobile responsive'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FiCheck className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/dashboard"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all block text-center"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-950">
              Everything you need to know about MeLearn
            </p>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                question: 'Does MeLearn require login?',
                answer: 'No, MeLearn works completely offline. Everything is stored locally in your browser, so no account or login is required.'
              },
              {
                question: 'Does it store my data?',
                answer: 'Your data stays completely private in your browser. We never collect, store, or access your personal study information.'
              },
              {
                question: 'Does it work offline?',
                answer: 'Most features work offline including tasks, notes, timer, and progress tracking. Only resource search requires internet connection.'
              },
              {
                question: 'Is it really free?',
                answer: 'Yes, 100% free forever. No hidden costs, no premium plans, no credit card required. We believe education should be accessible to everyone.'
              },
              {
                question: 'What browsers are supported?',
                answer: 'MeLearn works on all modern browsers including Chrome, Firefox, Safari, and Edge. Mobile browsers are fully supported too.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl mb-4 shadow-lg"
                variants={fadeInUp}
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  {openFaq === index ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-200">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <FiMessageCircle className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <blockquote className="text-2xl md:text-3xl font-light italic mb-6 max-w-4xl mx-auto">
              "{quote.content}"
            </blockquote>
            <p className="text-xl opacity-90">— {quote.author}</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Studying with MeLearn Today!
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who have transformed their learning journey. 
              It's free, it's powerful, and it's ready for you.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-white text-blue-900 font-bold text-xl px-12 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <MLLogo size="large" variant="dark" className="mb-4" />
              <p className="text-gray-400 mb-4">Made for Students</p>
              <p className="text-sm text-gray-500">Version 1.0.0</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><button className="hover:text-white transition-colors">Features</button></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Start Learning</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  <a 
                    href="mailto:menyothycode@gmail.com" 
                    className="hover:text-white transition-colors"
                  >
                    menyothycode@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FiHeart className="w-4 h-4" />
                  <span>Made with love for Me 'N' You.</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/MENYOTHYCODE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  title="GitHub Profile"
                >
                  <FiGithub className="w-6 h-6" />
                </a>
                <FiTwitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" title="Twitter (Coming Soon)" />
                <a 
                  href="mailto:menyothycode@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Send Email"
                >
                  <FiMail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MeLearn. Made for students, by MENYOTHYCODE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
