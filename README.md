# 🧠 MeLearn - Personal Study Companion

A complete, fully-functional React + TailwindCSS frontend application that helps students track tasks, take notes, study with focus mode, track progress, and access study resources.

## ✨ Features

### 📊 Dashboard
- Daily stats: completed tasks, study time, notes count
- Weekly progress chart using Recharts
- Motivational quotes from Quotable API
- Today's goal & streak tracking

### ✅ Study Planner
- Add, edit, delete tasks
- Mark tasks as complete
- Filter by subject
- Due date tracking
- LocalStorage persistence

### 📝 Notes System
- Color-coded notes
- Search functionality
- Auto-save to LocalStorage
- Clean, organized interface

### ⏰ Study Room / Focus Mode
- Pomodoro Timer (customizable work/break intervals)
- Full-screen mode
- Track total study time
- Browser notifications
- Minimal distraction UI

### 🎯 Goals & Progress
- Set daily, weekly, and monthly goals
- Track study streaks
- Visual progress charts
- Subject breakdown with pie charts
- Achievement milestones

### 📚 Resources Page
- **Google Books API** - Search books by subject/topic
- **YouTube Data API** - Find study tutorials
- **Wikipedia API** - Fetch topic summaries
- **Dictionary API** - Word meanings, examples, pronunciation
- Tabbed interface for easy navigation

### ⚙️ Settings / Profile
- Set name and preferred subjects
- Dark/Light mode toggle
- Reset app data
- View study stats summary

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up YouTube API key:
   - Copy `.env.example` to `.env`
   - Get your API key from [Google Cloud Console](https://console.developers.google.com/)
   - Add your key to `.env`:
     ```
     VITE_YOUTUBE_API_KEY=your_api_key_here
     ```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Top navigation bar
│   ├── Sidebar.jsx          # Side navigation menu
│   ├── TaskCard.jsx         # Task display component
│   ├── NoteCard.jsx         # Note display component
│   ├── Timer.jsx            # Pomodoro timer
│   ├── ProgressChart.jsx    # Weekly study chart
│   ├── QuoteCard.jsx        # Motivational quotes
│   ├── ResourceCard.jsx     # Resource display
│   ├── SearchBar.jsx        # Search input
│   └── Modal.jsx            # Modal dialog
├── pages/
│   ├── Landing.jsx          # Landing page
│   ├── Dashboard.jsx        # Main dashboard
│   ├── Planner.jsx          # Task planner
│   ├── Notes.jsx            # Notes manager
│   ├── StudyRoom.jsx        # Focus mode
│   ├── Goals.jsx            # Goals & progress
│   ├── Resources.jsx        # Study resources
│   └── Settings.jsx         # Settings page
├── context/
│   └── ThemeContext.jsx     # Theme management
├── hooks/
│   └── useLocalStorage.js   # LocalStorage hook
├── utils/
│   ├── calculateProgress.js # Progress calculations
│   └── subjectColors.js     # Color schemes
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## 🛠️ Technologies

- **React 18** - UI library with concurrent rendering
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library
- **Vite** - Fast build tool and dev server

## 🌐 APIs Used

1. **Quotable API** - Random motivational quotes
   - No API key required
   - `https://api.quotable.io/random`

2. **Google Books API** - Search books
   - No API key required
   - `https://www.googleapis.com/books/v1/volumes`

3. **YouTube Data API v3** - Search videos
   - Requires API key
   - `https://www.googleapis.com/youtube/v3/search`

4. **Wikipedia API** - Topic summaries
   - No API key required
   - `https://en.wikipedia.org/api/rest_v1/page/summary`

5. **Dictionary API** - Word definitions
   - No API key required
   - `https://api.dictionaryapi.dev/api/v2/entries/en`

6. **Browser Notification API** - Pomodoro reminders

## 💾 Data Storage

All user data is stored in browser LocalStorage:
- Tasks
- Notes
- Goals
- Study sessions
- User preferences
- Theme settings

## 🎨 Features Highlights

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Full dark theme support
- **Smooth Animations** - Polished transitions and interactions
- **Accessibility** - Semantic HTML and ARIA labels
- **Performance** - Optimized with React best practices

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🤝 Contributing

This is a complete, standalone application. Feel free to:
- Customize the design
- Add new features
- Integrate additional APIs
- Improve existing functionality

## 📄 License

MIT

## 🙏 Acknowledgments

- Icons from React Icons
- Charts from Recharts
- Styling with TailwindCSS
- APIs from various free services

---

**Built with ❤️ for students who want to stay organized and motivated!**
