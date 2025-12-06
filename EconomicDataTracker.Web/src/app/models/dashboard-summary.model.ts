export interface DashboardSummary {
  seriesId: number;
  name: string;
  description: string;
  latestValue?: number;
  latestDate?: Date;
  previousValue?: number;
  previousDate?: Date;
  changeValue?: number;
  changePercent?: number;
}
