export interface MusicChallenge {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  points: number;
  audioUrl: string; // Path to provided .mp3 file
  imageUrl?: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  progress: number; // 0-100
  completedAt?: string;
}

export interface Track {
  id: string;
  url: string; // Local file path to provided .mp3
  title: string;
  artist: string;
  artwork?: string;
  duration?: number;
}

export interface PointsCounterConfig {
  totalPoints: number;
  durationSeconds: number;
  challengeId: string;
}

