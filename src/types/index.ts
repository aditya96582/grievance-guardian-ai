
export type SentimentType = 'positive' | 'neutral' | 'negative';

export type PriorityType = 'critical' | 'high' | 'medium' | 'low';

export type StatusType = 'open' | 'processing' | 'resolved' | 'closed';

export type DepartmentType = 
  | 'water_supply'
  | 'electricity'
  | 'sanitation'
  | 'roads'
  | 'healthcare'
  | 'education'
  | 'law_enforcement'
  | 'housing'
  | 'agriculture'
  | 'other';

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: DepartmentType;
  sentiment: SentimentType;
  priority: PriorityType;
  status: StatusType;
  submittedBy: string;
  contactNumber: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  actionTaken?: string;
  assignedTo?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'citizen' | 'admin' | 'department_officer';
  department?: DepartmentType;
}
