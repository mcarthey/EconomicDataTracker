import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActionPlan,
  ActionRecommendation,
  UserProfile,
  USER_PROFILE_LABELS
} from '../../models/action-recommendation.model';

@Component({
  selector: 'app-action-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './action-recommendations.component.html',
  styleUrls: ['./action-recommendations.component.css']
})
export class ActionRecommendationsComponent {
  @Input() actionPlan!: ActionPlan;
  @Output() profileChange = new EventEmitter<UserProfile>();

  selectedProfile: UserProfile = 'general';
  profileLabels = USER_PROFILE_LABELS;

  // Expose UserProfile type to template
  profiles: UserProfile[] = [
    'general',
    'conservative-investor',
    'aggressive-investor',
    'homeowner',
    'renter',
    'job-seeker',
    'business-owner'
  ];

  expandedRecommendations: Set<string> = new Set();

  ngOnInit() {
    if (this.actionPlan) {
      this.selectedProfile = this.actionPlan.profile;
    }
  }

  onProfileChange(profile: UserProfile): void {
    this.selectedProfile = profile;
    this.profileChange.emit(profile);
  }

  toggleRecommendation(id: string): void {
    if (this.expandedRecommendations.has(id)) {
      this.expandedRecommendations.delete(id);
    } else {
      this.expandedRecommendations.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedRecommendations.has(id);
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '📋';
      case 'low': return '💡';
      default: return '📋';
    }
  }

  getTimeframeLabel(timeframe: string): string {
    switch (timeframe) {
      case 'immediate': return 'Act Now';
      case 'short-term': return '1-3 Months';
      case 'medium-term': return '3-12 Months';
      case 'long-term': return '1+ Years';
      default: return timeframe;
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'emergency-fund': return '🛡️';
      case 'investment': return '📈';
      case 'real-estate': return '🏠';
      case 'employment': return '💼';
      case 'spending': return '💳';
      case 'debt': return '💰';
      default: return '📋';
    }
  }

  getRecommendationsByCategory(category: string): ActionRecommendation[] {
    return this.actionPlan.recommendations.filter(r => r.category === category);
  }

  getUniqueCategories(): string[] {
    const categories = new Set(this.actionPlan.recommendations.map(r => r.category));
    return Array.from(categories);
  }

  getCategoryDisplayName(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
