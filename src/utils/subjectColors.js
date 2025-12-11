export const subjectColors = {
  Math: 'bg-blue-500',
  Science: 'bg-green-500',
  English: 'bg-purple-500',
  History: 'bg-yellow-500',
  Physics: 'bg-red-500',
  Chemistry: 'bg-teal-500',
  Biology: 'bg-emerald-500',
  Computer: 'bg-indigo-500',
  Art: 'bg-pink-500',
  Music: 'bg-orange-500',
  Other: 'bg-gray-500',
};

export const getSubjectColor = (subject) => {
  return subjectColors[subject] || subjectColors.Other;
};

export const noteColors = [
  { name: 'Yellow', class: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300' },
  { name: 'Blue', class: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300' },
  { name: 'Green', class: 'bg-green-100 dark:bg-green-900/30 border-green-300' },
  { name: 'Pink', class: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300' },
  { name: 'Purple', class: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300' },
];
