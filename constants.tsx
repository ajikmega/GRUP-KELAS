
import { Channel, User } from './types.ts';

export const CHANNELS: Channel[] = [
  { id: 'general', name: 'Ruang Tengah', description: 'Diskusi umum XI DKV', icon: '🎨' },
  { id: 'design-feedback', name: 'Design Review', description: 'Kritik dan saran karya', icon: '👁️' },
  { id: 'tutorial', name: 'Tips & Trick', description: 'Sharing software & asset', icon: '🪄' },
  { id: 'project-deadline', name: 'Deadline Info', description: 'Info tugas & project', icon: '📅' },
  { id: 'announcements', name: 'Pengumuman', description: 'Informasi resmi sekolah', icon: '📢' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Pak Andi (Guru)', avatar: 'https://picsum.photos/seed/teacher/100', role: 'teacher', isOnline: true },
  { id: 'u2', name: 'Budi Visual', avatar: 'https://picsum.photos/seed/budi/100', role: 'student', isOnline: true },
  { id: 'u3', name: 'Citra Illustrator', avatar: 'https://picsum.photos/seed/citra/100', role: 'student', isOnline: false },
  { id: 'u4', name: 'Creative Assistant AI', avatar: 'https://picsum.photos/seed/creative-ai/100', role: 'assistant', isOnline: true },
  { id: 'me', name: 'You (Designer)', avatar: 'https://picsum.photos/seed/me/100', role: 'student', isOnline: true },
];

export const COMMON_EMOJIS = [
  '😀', '😍', '👍', '🔥', '🎨', '✨', '🚀', '💯', 
  '🖌️', '📷', '🎬', '💡', '👁️', '💻', '✏️', '📍',
  '🌈', '📐', '🧠', '🎓', '🏫', '⏰', '🖼️', '🌟'
];
