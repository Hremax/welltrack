export type Activity = {
  type: 'exercise' | 'meal' | 'water';
  name?: string;
  duration?: number;
  calories?: number;
  quantity?: number;
  unit?: string;
};

export type Metric = {
  type: 'steps' | 'sleep' | 'mood';
  value: number;
};

export type Goal = {
  activityType: string;
  targetQuantity: string;
  explanation: string;
};
