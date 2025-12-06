export interface Series {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  lastUpdated?: Date;
  observationCount: number;
}
