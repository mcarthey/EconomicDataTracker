import { Series } from './series.model';
import { Observation } from './observation.model';

export interface SeriesWithObservations {
  series: Series;
  observations: Observation[];
}
