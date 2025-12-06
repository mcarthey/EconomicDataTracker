import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Series } from '../models/series.model';
import { Observation } from '../models/observation.model';
import { DashboardSummary } from '../models/dashboard-summary.model';
import { SeriesWithObservations } from '../models/series-with-observations.model';

@Injectable({
  providedIn: 'root'
})
export class EconomicDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Series endpoints
  getAllSeries(enabledOnly?: boolean): Observable<Series[]> {
    let params = new HttpParams();
    if (enabledOnly !== undefined) {
      params = params.set('enabledOnly', enabledOnly.toString());
    }
    return this.http.get<Series[]>(`${this.apiUrl}/series`, { params });
  }

  getSeriesById(id: number): Observable<Series> {
    return this.http.get<Series>(`${this.apiUrl}/series/${id}`);
  }

  getSeriesWithObservations(
    id: number,
    startDate?: Date,
    endDate?: Date
  ): Observable<SeriesWithObservations> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<SeriesWithObservations>(
      `${this.apiUrl}/series/${id}/observations`,
      { params }
    );
  }

  // Observations endpoints
  getFilteredObservations(
    seriesIds?: number[],
    startDate?: Date,
    endDate?: Date,
    limit?: number,
    sortBy?: string,
    sortOrder?: string
  ): Observable<Observation[]> {
    let params = new HttpParams();

    if (seriesIds && seriesIds.length > 0) {
      params = params.set('seriesIds', seriesIds.join(','));
    }
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    return this.http.get<Observation[]>(`${this.apiUrl}/observations`, { params });
  }

  getLatestObservations(seriesIds?: number[]): Observable<Observation[]> {
    let params = new HttpParams();
    if (seriesIds && seriesIds.length > 0) {
      params = params.set('seriesIds', seriesIds.join(','));
    }
    return this.http.get<Observation[]>(`${this.apiUrl}/observations/latest`, { params });
  }

  // Dashboard endpoints
  getDashboardSummary(enabledOnly?: boolean): Observable<DashboardSummary[]> {
    let params = new HttpParams();
    if (enabledOnly !== undefined) {
      params = params.set('enabledOnly', enabledOnly.toString());
    }
    return this.http.get<DashboardSummary[]>(`${this.apiUrl}/dashboard/summary`, { params });
  }

  getTrends(seriesIds?: number[], period?: string): Observable<SeriesWithObservations[]> {
    let params = new HttpParams();
    if (seriesIds && seriesIds.length > 0) {
      params = params.set('seriesIds', seriesIds.join(','));
    }
    if (period) {
      params = params.set('period', period);
    }
    return this.http.get<SeriesWithObservations[]>(`${this.apiUrl}/dashboard/trends`, { params });
  }
}
