# MeLearn Usage Guide

## Getting Started

1. **First Visit**: When you first open MeLearn, you'll see the landing page with an overview of features.

2. **Navigate to Dashboard**: Click "Get Started" or "Launch Dashboard" to enter the application.

## Features Guide

### 📊 Dashboard
- **Overview**: See your daily stats at a glance
- **Weekly Chart**: Visual representation of your study time across the week
- **Motivational Quote**: Get inspired with a new quote (click refresh to get another)
- **Progress Bars**: Track your daily goals and task completion

### ✅ Study Planner

**Adding Tasks:**
1. Click the "Add Task" button
2. Fill in:
   - Title (required)
   - Description (optional)
   - Subject (select from dropdown)
   - Due Date (optional)
3. Click "Add Task"

**Managing Tasks:**
- Click the checkbox to mark complete/incomplete
- Click the edit icon to modify
- Click the trash icon to delete
- Use filters to view specific subjects or completion status

### 📝 Notes

**Creating Notes:**
1. Click "New Note"
2. Enter a title and content
3. Choose a color for organization
4. Click "Create Note"

**Finding Notes:**
- Use the search bar to find notes by title or content
- Notes are color-coded for easy visual organization
- Click any note to edit it

### ⏰ Study Room (Focus Mode)

**Using the Pomodoro Timer:**
1. Set your work duration (default: 25 minutes)
2. Set your break duration (default: 5 minutes)
3. Click "Start" to begin
4. The timer will automatically switch between work and break sessions
5. You'll receive browser notifications when sessions complete

**Additional Features:**
- Click "Fullscreen" for distraction-free studying
- Toggle "Sound On/Off" for ambient background sound
- View your recent study sessions below the timer

### 🎯 Goals & Progress

**Setting Goals:**
- Adjust daily, weekly, and monthly goals using the input fields
- Goals are measured in minutes of study time
- Progress bars show your current achievement

**Tracking Progress:**
- View study time breakdown by subject (pie chart)
- Check achievement milestones
- Monitor your progress toward goals

### 📚 Resources

**Searching for Resources:**
1. Select a tab: Books, Videos, Topics, or Dictionary
2. Enter your search term
3. Click "Search"

**Resource Types:**
- **Books**: Search Google Books for textbooks and references
- **Videos**: Find educational YouTube videos (requires API key)
- **Topics**: Get Wikipedia summaries for quick overviews
- **Dictionary**: Look up word definitions, pronunciations, and examples

**Note**: To use YouTube search, you need to:
1. Get an API key from [Google Cloud Console](https://console.developers.google.com/)
2. Create a `.env` file in the project root
3. Add: `VITE_YOUTUBE_API_KEY=your_key_here`

### ⚙️ Settings

**Profile Setup:**
- Enter your name
- Select your preferred subjects
- Click "Save Profile"

**Appearance:**
- Toggle between Light and Dark mode
- Theme preference is saved automatically

**Stats Summary:**
- View your total study time
- Check your current streak
- See tasks completed and total notes

**Reset Data:**
- Use the "Reset All Data" button to clear everything
- ⚠️ Warning: This action cannot be undone!

## Tips for Best Results

1. **Set Realistic Goals**: Start with achievable daily goals and increase gradually

2. **Use the Pomodoro Timer**: Regular breaks improve focus and retention

3. **Color-Code Your Notes**: Use different colors for different subjects

4. **Review Your Progress**: Check the dashboard regularly to stay motivated

5. **Organize Tasks by Subject**: Use subject filters to focus on specific areas

6. **Take Advantage of Resources**: Use the Resources page to find study materials

7. **Build a Streak**: Study consistently to build and maintain your streak

8. **Enable Notifications**: Allow browser notifications for Pomodoro reminders

## Keyboard Shortcuts

- **Fullscreen Mode**: F11 (browser default)
- **Search**: Click in any search bar and start typing

## Data Storage

- All your data is stored locally in your browser
- Data persists between sessions
- Clearing browser data will delete your MeLearn data
- No account or internet connection required (except for Resources)

## Troubleshooting

**Problem**: YouTube videos not showing
- **Solution**: Add your YouTube API key to `.env` file

**Problem**: Notifications not working
- **Solution**: Allow notifications when prompted by your browser

**Problem**: Dark mode not working
- **Solution**: Check Settings and toggle the theme

**Problem**: Data disappeared
- **Solution**: Check if browser data was cleared. Unfortunately, LocalStorage data cannot be recovered

## Browser Compatibility

MeLearn works best on:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires:
- JavaScript enabled
- LocalStorage enabled
- Modern browser (ES6+ support)

## Privacy

- No data is sent to external servers (except API requests for resources)
- No tracking or analytics
- No user accounts required
- All personal data stays on your device

---

**Need Help?** Check the README.md for technical details or create an issue on the project repository.
