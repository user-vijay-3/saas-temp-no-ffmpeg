export interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface VideoState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export type AspectRatio = "16:9" | "9:16" | "4:3";
