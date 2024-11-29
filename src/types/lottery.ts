export interface ResultConfig {
  title: string;
  modalText: string;
  sound1: string;
  sound1Volume: number;
  sound2: string;
  sound2Volume: number;
}

export interface PrizeTier {
  id: string;
  probability: number;
  count: number;
  config: ResultConfig;
  wonCount: number;
}