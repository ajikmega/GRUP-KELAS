
export type UserRole = 'student' | 'teacher' | 'assistant';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  reactions: Record<string, string[]>; // emoji -> userIds[]
  channelId: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
}
