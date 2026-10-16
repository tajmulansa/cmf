export type Word = {w: string; start: number; end: number}; // seconds, relative to scene start

export type SceneProps = {
  template: 'hook' | 'map' | 'number' | 'image' | 'text';
  params: Record<string, any>;
  text: string;
  words: Word[];
  audio: string | null; // path inside public/, e.g. gen/voice_0.wav
  durationInFrames: number;
};

export type VideoProps = {
  fps: number;
  scenes: SceneProps[];
};
