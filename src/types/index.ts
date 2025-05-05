
export interface TicketMetadata {
  id: string;
  key: string;
  summary: string;
  assignee: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  reporter: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  status: string;
  type: string;
  priority: string;
  created: string;
  updated: string;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  required: boolean;
  defaultValue?: number;
}

export interface TicketEvaluation {
  id: string;
  ticketId: string;
  ticketKey: string;
  evaluatorId: string;
  evaluatorDisplayName: string;
  timestamp: string;
  criteria: {
    [criteriaId: string]: number;
  };
  averageScore: number;
  feedback: string;
  version: number;
}

export interface EvaluationHistory {
  evaluations: TicketEvaluation[];
  totalCount: number;
}

export interface AnalyticsFilter {
  dateRange: [Date | null, Date | null];
  assignees: string[];
  evaluators: string[];
  ticketTypes: string[];
  projects: string[];
  criteriaScoreRanges: {
    [criteriaId: string]: [number, number];
  };
}

export interface AnalyticsData {
  overviewStats: {
    totalEvaluations: number;
    averageScore: number;
    evaluationsByDay: Array<{ date: string; count: number }>;
    scoreDistribution: Array<{ score: number; count: number }>;
  };
  criteriaStats: {
    [criteriaId: string]: {
      averageScore: number;
      distribution: Array<{ score: number; count: number }>;
    };
  };
  assigneeStats: {
    [assigneeId: string]: {
      averageScore: number;
      evaluationCount: number;
      criteriaScores: {
        [criteriaId: string]: number;
      };
    };
  };
  rawData: TicketEvaluation[];
}

export type ExportFormat = 'excel' | 'csv' | 'pdf';
