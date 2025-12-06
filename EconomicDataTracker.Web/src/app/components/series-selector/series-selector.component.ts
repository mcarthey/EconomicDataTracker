import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Series } from '../../models/series.model';

@Component({
  selector: 'app-series-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './series-selector.component.html',
  styleUrls: ['./series-selector.component.css']
})
export class SeriesSelectorComponent {
  @Input() allSeries: Series[] = [];
  @Input() selectedIds: number[] = [];
  @Output() selectionChange = new EventEmitter<number[]>();

  showDropdown: boolean = false;

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  isSelected(seriesId: number): boolean {
    return this.selectedIds.includes(seriesId);
  }

  toggleSeries(seriesId: number): void {
    const index = this.selectedIds.indexOf(seriesId);
    let newSelection: number[];

    if (index > -1) {
      // Remove from selection
      newSelection = this.selectedIds.filter(id => id !== seriesId);
    } else {
      // Add to selection
      newSelection = [...this.selectedIds, seriesId];
    }

    this.selectionChange.emit(newSelection);
  }

  selectAll(): void {
    const allIds = this.allSeries.map(s => s.id);
    this.selectionChange.emit(allIds);
  }

  clearAll(): void {
    this.selectionChange.emit([]);
  }

  getSelectedSeriesNames(): string {
    if (this.selectedIds.length === 0) {
      return 'No series selected';
    }
    if (this.selectedIds.length === this.allSeries.length) {
      return 'All series selected';
    }
    const names = this.selectedIds
      .map(id => this.allSeries.find(s => s.id === id)?.name)
      .filter(name => name)
      .slice(0, 3);

    const displayText = names.join(', ');
    return this.selectedIds.length > 3
      ? `${displayText} (+${this.selectedIds.length - 3} more)`
      : displayText;
  }
}
