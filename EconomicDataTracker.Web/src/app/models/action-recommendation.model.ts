export type UserProfile =
  | 'conservative-investor'
  | 'aggressive-investor'
  | 'homeowner'
  | 'renter'
  | 'job-seeker'
  | 'business-owner'
  | 'general';

export interface ActionRecommendation {
  id: string;
  category: 'emergency-fund' | 'investment' | 'real-estate' | 'employment' | 'spending' | 'debt';
  icon: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term'; // immediate, 1-3 months, 3-12 months, 1+ years
  profiles: UserProfile[]; // Which user profiles this applies to
  reasoning: string; // Why this action is recommended based on current conditions
  relevantIndicators: string[]; // Which indicators triggered this recommendation
}

export interface ActionPlan {
  profile: UserProfile;
  recommendations: ActionRecommendation[];
  summary: string;
  economicOutlook: string;
}

export const USER_PROFILE_LABELS: Record<UserProfile, string> = {
  'conservative-investor': '💼 Conservative Investor',
  'aggressive-investor': '📈 Aggressive Investor',
  'homeowner': '🏠 Homeowner',
  'renter': '🏢 Renter',
  'job-seeker': '💼 Job Seeker',
  'business-owner': '🏢 Business Owner',
  'general': '👤 General'
};
