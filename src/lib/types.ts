export type PitchType = 'straight' | 'lob' | 'spin' | 'curve' | 'golden';

export interface JudgeResult {
  received: boolean;
  selfDisclosure: boolean;
  asksQuestion: boolean;
  gratitude: boolean;
  novelty: number;
  pitchType: PitchType;
  speed: number;
  scoreDelta: number;
  feedbackText: string;
}

export interface Message {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
  judgeResult: JudgeResult;
  bonusScore: number;
}

export interface Player {
  id: string;
  name: string;
}

export interface RoomState {
  id: string;
  players: Player[];
  score: number;
  rally: number;
  status: 'waiting' | 'playing' | 'finished';
  messages?: Message[];
}
