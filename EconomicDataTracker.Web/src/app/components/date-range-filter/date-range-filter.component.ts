import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.css']
})
export class DateRangeFilterComponent {
  @Output() dateRangeChange = new EventEmitter<{ startDate?: Date; endDate?: Date }>();

  startDateString: string = '';
  endDateString: string = '';

  onDateChange(): void {
    const startDate = this.startDateString ? new Date(this.startDateString) : undefined;
    const endDate = this.endDateString ? new Date(this.endDateString) : undefined;

    this.dateRangeChange.emit({ startDate, endDate });
  }

  clearDates(): void {
    this.startDateString = '';
    this.endDateString = '';
    this.dateRangeChange.emit({});
  }
}
