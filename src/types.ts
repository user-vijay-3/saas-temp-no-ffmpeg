export interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
  style?: SubtitleStyle;
}

export interface SubtitleStyle {
  positionX: number;
  positionY: number;
  fontName: string;
  fontSize: number;
  primaryColor: string;
  secondaryColor: string;
  outlineColor: string;
  backColor: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeOut: boolean;
  scaleX: number;
  scaleY: number;
  spacing: number;
  angle: number;
  borderStyle: number;
  outline: number;
  shadow: number;
  alignment: number;
  marginL: number;
  marginR: number;
  marginV: number;
  encoding: number;
  primaryAlpha: number;
  secondaryAlpha: number;
  useSecondaryColor?: boolean;
  useBackColor?: boolean;
  glowEnabled?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  outlineWidth?: number;
  shadowDepth?: number;
}

export interface SubtitleItem {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
  position: {
    x: number;
    y: number;
  };
  style: {
    fontSize: number;
    color: string;
    strokeColor: string;
    strokeWidth: number;
  };
}

export interface VideoState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export type AspectRatio = '16:9' | '9:16' | '4:3';