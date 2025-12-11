import { motion } from 'framer-motion';
import { 
  FiBookOpen, FiTarget, FiUsers, FiStar, FiHeart, FiZap,
  FiGlobe, FiTrendingUp, FiAward, FiArrowRight, FiCheck,
  FiUser, FiGift, FiMessageCircle, FiShare2
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import MLLogo from '../components/MLLogo';

const LearnMore = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-[#1277C9] to-[#1277C9] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Navigation */}
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Learn More About MeLearn
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Discover the story, mission, and vision behind the platform that's transforming how students learn, organize, and succeed.
            </motion.p>

            {/* Hero Illustration */}
            <motion.div 
              className="mt-12 relative"
              variants={fadeInUp}
            >
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 backdrop-blur-sm border border-white/20">
                <div className="text-8xl mb-4">📚✨🎓</div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Empowering Students Worldwide</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What is MeLearn Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl font-bold mb-6">What is MeLearn?</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-12 items-center" variants={fadeInUp}>
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                  Your Complete Digital Study Companion
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  MeLearn is a comprehensive learning platform designed specifically for modern students who want to study smarter, not harder. We understand that today's learners face unique challenges: information overload, scattered resources, and the constant battle against distractions.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  That's why we created MeLearn – to bring everything you need into one beautiful, intuitive platform. From intelligent task management and note-taking to focus tools and instant access to educational resources, MeLearn is your all-in-one solution for academic success.
                </p>
                
                <div className="space-y-4">
                  {[
                    'Designed for students of all levels',
                    'Combines productivity with learning resources',
                    'Helps you stay organized and focused',
                    'Provides instant access to knowledge'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">🎯📊💡</div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Everything you need to excel in your studies
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl font-bold mb-6">Our Mission & Vision</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Driving the future of education through innovation and accessibility
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <FiTarget className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To transform the learning experience by providing students with intelligent, integrated tools that make studying more effective, enjoyable, and accessible. We're committed to promoting digital literacy, supporting academic excellence, and empowering every student to reach their full potential through innovative technology and thoughtful design.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <FiGlobe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To become the world's most trusted learning companion – a unified hub where students from every corner of the globe can access knowledge, stay organized, and achieve academic excellence. We envision a future where learning is seamless, personalized, and empowering for every student, regardless of their background or circumstances.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MeLearn Story Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl font-bold mb-6">The MeLearn Story</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            </motion.div>

            <motion.div className="prose prose-lg max-w-none" variants={fadeInUp}>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                  Born from Student Struggles
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  MeLearn was born from a simple observation: students today are drowning in digital chaos. Scattered notes across multiple apps, bookmarks lost in browser tabs, study materials spread across different platforms, and the constant battle against distractions that pull focus away from learning.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  The idea sparked during late-night study sessions, watching fellow students struggle with the same problems: "Where did I save that important note?" "Which app had my study schedule?" "How do I find reliable resources quickly?" These weren't just minor inconveniences – they were barriers to effective learning.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  We realized that while technology had advanced tremendously, the tools available to students were fragmented and often overwhelming. There was a gap between what students needed and what was available – a unified, intuitive platform that could serve as their complete digital study companion.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  That's when MeLearn began to take shape. Not just as another study app, but as a comprehensive solution that understands the modern student's journey. Every feature, every design decision, and every integration was crafted with one goal in mind: making learning more effective, organized, and enjoyable.
                </p>
              </div>

              {/* Large Study Image Placeholder */}
              <motion.div 
                className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl p-16 text-center mb-12"
                variants={fadeInUp}
              >
                <div className="text-8xl mb-6">👩‍🎓📱💻📚</div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Modern Learning, Simplified
                </h4>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  From scattered chaos to organized success – MeLearn brings everything together in one beautiful, intuitive platform designed for the way students actually learn.
                </p>
              </motion.div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4">Growing with Our Community</h3>
                <p className="mb-4 opacity-90 leading-relaxed">
                  Today, MeLearn continues to evolve based on feedback from our amazing community of learners. Every update, every new feature, and every improvement comes from listening to what students actually need. We're not just building a platform – we're building a movement toward better, more effective learning.
                </p>
                <p className="opacity-90 leading-relaxed">
                  Join thousands of students who have already transformed their learning journey with MeLearn. Your success story could be next.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ambassador Program Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl font-bold mb-6">MeLearn Ambassador Program</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Join our community of passionate learners and help spread the word about effective studying
              </p>
            </motion.div>

            <motion.div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg mb-12" variants={fadeInUp}>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    What is the Ambassador Program?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    The MeLearn Ambassador Program is a community of enthusiastic students who believe in the power of organized, effective learning. As an ambassador, you'll help fellow students discover MeLearn while gaining valuable leadership experience and exclusive benefits.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    Whether you're sharing MeLearn with classmates, creating content about study tips, or providing feedback to help us improve, ambassadors play a crucial role in building our learning community.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">🌟👥🚀</div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Be part of the learning revolution
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg" variants={fadeInUp}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">Who Can Join?</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Active MeLearn users</li>
                  <li>• Passionate about learning and productivity</li>
                  <li>• Enjoy helping fellow students</li>
                  <li>• Active on social media or in student communities</li>
                  <li>• Committed to promoting positive study habits</li>
                </ul>
              </motion.div>

              <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg" variants={fadeInUp}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <FiGift className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">Ambassador Benefits</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Exclusive MeLearn merchandise</li>
                  <li>• Early access to new features</li>
                  <li>• Direct line to the development team</li>
                  <li>• Recognition in our community</li>
                  <li>• Leadership and networking opportunities</li>
                </ul>
              </motion.div>
            </div>

            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-8 text-center"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Help us build a community where every student has the tools they need to succeed. Your voice matters, and your passion can inspire others.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2 justify-center">
                  Join the Ambassador Program <FiArrowRight />
                </button>
                <Link
                  to="/dashboard"
                  className="border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all inline-flex items-center gap-2 justify-center"
                >
                  Start Using MeLearn <FiStar />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who have already discovered the power of organized, effective learning with MeLearn.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-white text-blue-900 font-bold text-xl px-12 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Learning Today
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
              <p className="text-gray-400 mb-4">Empowering Students Worldwide</p>
              <p className="text-sm text-gray-500">Version 1.0.0</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/learn-more" className="hover:text-white transition-colors">Learn More</Link></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Start Learning</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <FiMessageCircle className="w-4 h-4" />
                  <a 
                    href="mailto:menyothycode@gmail.com" 
                    className="hover:text-white transition-colors"
                  >
                    menyothycode@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FiHeart className="w-4 h-4" />
                  <span>Made with love</span>
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
                  <FiShare2 className="w-6 h-6" />
                </a>
                <a 
                  href="mailto:menyothycode@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Send Email"
                >
                  <FiMessageCircle className="w-6 h-6" />
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

export default LearnMore;