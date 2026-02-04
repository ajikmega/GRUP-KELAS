
import React from 'react';
import { Channel, User } from './types';

export const CHANNELS: Channel[] = [
  { id: 'general', name: 'General Chat', description: 'Public discussion for everyone', icon: '🌍' },
  { id: 'math', name: 'Math Class', description: 'Calculus and Algebra help', icon: '📐' },
  { id: 'science', name: 'Science Lab', description: 'Experiments and reports', icon: '🧪' },
  { id: 'homework', name: 'Homework Help', description: 'Get help with your tasks', icon: '📚' },
  { id: 'announcements', name: 'Announcements', description: 'Official news from teachers', icon: '📢' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Alice (Teacher)', avatar: 'https://picsum.photos/seed/alice/100', role: 'teacher', isOnline: true },
  { id: 'u2', name: 'Bob', avatar: 'https://picsum.photos/seed/bob/100', role: 'student', isOnline: true },
  { id: 'u3', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie/100', role: 'student', isOnline: false },
  { id: 'u4', name: 'Gemini AI', avatar: 'https://picsum.photos/seed/ai/100', role: 'assistant', isOnline: true },
  { id: 'me', name: 'You', avatar: 'https://picsum.photos/seed/user/100', role: 'student', isOnline: true },
];

export const COMMON_EMOJIS = [
  '😀', '😂', '😍', '👍', '🔥', '🙌', '🚀', '💯', 
  '🤔', '👀', '🎉', '❤️', '✨', '👏', '✅', '❌',
  '📚', '📝', '🧠', '🎓', '🏫', '⏰', '💡', '🌟'
];
