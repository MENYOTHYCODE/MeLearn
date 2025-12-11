import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { FiPlus } from 'react-icons/fi';
import { noteColors } from '../utils/subjectColors';

const Notes = () => {
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: noteColors[0].class
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingNote) {
      setNotes(notes.map(note =>
        note.id === editingNote.id
          ? { ...formData, id: note.id, updatedAt: new Date().toISOString() }
          : note
      ));
    } else {
      setNotes([...notes, {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', color: noteColors[0].class });
    setEditingNote(null);
    setIsModalOpen(false);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      color: note.color
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notes</h1>
          <p className="text-gray-600 dark:text-gray-200">
            Capture your thoughts and study materials
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> New Note
        </button>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={() => {}}
        placeholder="Search notes..."
      />

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-gray-500 dark:text-gray-200 text-lg">
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingNote ? 'Edit Note' : 'New Note'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input-field"
              rows="10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-3">
              {noteColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.class })}
                  className={`w-12 h-12 rounded-lg border-2 ${color.class} ${
                    formData.color === color.class ? 'ring-4 ring-blue-500' : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingNote ? 'Update Note' : 'Create Note'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notes;
