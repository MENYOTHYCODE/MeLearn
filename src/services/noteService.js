import { noteColors } from '../utils/subjectColors';

const NOTES_KEY = 'notes';

export function addNote({ title = '', content = '', color = null, category = '' } = {}) {
  try {
    const notes = JSON.parse(window.localStorage.getItem(NOTES_KEY) || '[]');
    const newNote = {
      id: Date.now(),
      title: title || 'Untitled',
      content: content || '',
      color: color || noteColors[0].class,
      category: category || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return newNote;
  } catch (err) {
    console.error('Failed to save note:', err);
    return null;
  }
}

export function getNotes() {
  try {
    return JSON.parse(window.localStorage.getItem(NOTES_KEY) || '[]');
  } catch (err) {
    console.error('Failed to read notes:', err);
    return [];
  }
}

export default { addNote, getNotes };
