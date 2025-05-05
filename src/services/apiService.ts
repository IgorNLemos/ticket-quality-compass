
import { TicketMetadata, TicketEvaluation, EvaluationCriteria, EvaluationHistory, AnalyticsData, AnalyticsFilter, ExportFormat } from '../types';

// Mock data for development
const MOCK_CRITERIA: EvaluationCriteria[] = [
  {
    id: 'clarity',
    name: 'Clarity of Description',
    description: 'How clearly is the issue or feature described?',
    required: true,
    defaultValue: 5
  },
  {
    id: 'completeness',
    name: 'Completeness of Requirements',
    description: 'Are all requirements clearly specified?',
    required: true,
    defaultValue: 5
  },
  {
    id: 'reproducibility',
    name: 'Reproducibility (for bugs)',
    description: 'How easily can the issue be reproduced?',
    required: false,
    defaultValue: 5
  },
  {
    id: 'documentation',
    name: 'Technical Documentation',
    description: 'Is supporting documentation sufficient?',
    required: true,
    defaultValue: 5
  },
  {
    id: 'testCoverage',
    name: 'Test Coverage',
    description: 'Are test cases included and comprehensive?',
    required: true,
    defaultValue: 5
  },
  {
    id: 'codeQuality',
    name: 'Code Quality',
    description: 'Is the implemented code well-structured and maintainable?',
    required: true,
    defaultValue: 5
  },
  {
    id: 'efficiency',
    name: 'Solution Efficiency',
    description: 'Is the implementation efficient and optimized?',
    required: true,
    defaultValue: 5
  },
  {
    id: 'adherence',
    name: 'Adherence to Standards',
    description: 'Does the issue or implementation follow team standards?',
    required: true,
    defaultValue: 5
  }
];

const MOCK_TICKET: TicketMetadata = {
  id: '12345',
  key: 'PROJECT-123',
  summary: 'Improve login form validation',
  assignee: {
    id: 'user1',
    displayName: 'Jane Smith',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
  },
  reporter: {
    id: 'user2',
    displayName: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'
  },
  status: 'In Progress',
  type: 'Task',
  priority: 'Medium',
  created: '2023-05-15T10:30:00Z',
  updated: '2023-05-16T14:20:00Z'
};

const MOCK_EVALUATIONS: TicketEvaluation[] = [
  {
    id: 'eval1',
    ticketId: '12345',
    ticketKey: 'PROJECT-123',
    evaluatorId: 'user3',
    evaluatorDisplayName: 'Mark Johnson',
    timestamp: '2023-05-17T09:15:00Z',
    criteria: {
      clarity: 8,
      completeness: 7,
      reproducibility: 9,
      documentation: 6,
      testCoverage: 7,
      codeQuality: 8,
      efficiency: 7,
      adherence: 8
    },
    averageScore: 7.5,
    feedback: 'Good ticket overall, but could use more technical documentation.',
    version: 1
  }
];

// Mock API functions (would be replaced by actual Forge API calls)
export const getTicketData = async (ticketId: string): Promise<TicketMetadata> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would call the Jira API
  // For now, return mock data
  return MOCK_TICKET;
};

export const getEvaluationCriteria = async (): Promise<EvaluationCriteria[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app, this would fetch from Forge storage
  return MOCK_CRITERIA;
};

export const getExistingEvaluation = async (ticketId: string): Promise<TicketEvaluation | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find existing evaluation for this ticket
  const evaluation = MOCK_EVALUATIONS.find(eval => eval.ticketId === ticketId);
  return evaluation || null;
};

export const getEvaluationHistory = async (
  ticketId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<EvaluationHistory> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Filter evaluations for this ticket
  const evaluations = MOCK_EVALUATIONS.filter(eval => eval.ticketId === ticketId);
  
  return {
    evaluations: evaluations.slice((page - 1) * pageSize, page * pageSize),
    totalCount: evaluations.length
  };
};

export const saveEvaluation = async (evaluation: Partial<TicketEvaluation>): Promise<TicketEvaluation> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would save to Forge storage
  const isNewEvaluation = !evaluation.id;
  
  const newEvaluation: TicketEvaluation = {
    id: evaluation.id || `eval${Date.now()}`,
    ticketId: evaluation.ticketId || '12345',
    ticketKey: evaluation.ticketKey || 'PROJECT-123',
    evaluatorId: evaluation.evaluatorId || 'currentUser',
    evaluatorDisplayName: evaluation.evaluatorDisplayName || 'Current User',
    timestamp: new Date().toISOString(),
    criteria: evaluation.criteria || {},
    averageScore: evaluation.averageScore || 0,
    feedback: evaluation.feedback || '',
    version: 1
  };
  
  // Calculate average score if not provided
  if (!evaluation.averageScore) {
    const scores = Object.values(newEvaluation.criteria);
    newEvaluation.averageScore = scores.length 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;
  }
  
  if (isNewEvaluation) {
    MOCK_EVALUATIONS.push(newEvaluation);
  } else {
    const index = MOCK_EVALUATIONS.findIndex(eval => eval.id === newEvaluation.id);
    if (index >= 0) {
      MOCK_EVALUATIONS[index] = newEvaluation;
    } else {
      MOCK_EVALUATIONS.push(newEvaluation);
    }
  }
  
  return newEvaluation;
};

export const getAnalyticsData = async (filters: AnalyticsFilter): Promise<AnalyticsData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, this would process data from Forge storage
  // For now, return mock analytics data
  return {
    overviewStats: {
      totalEvaluations: 25,
      averageScore: 7.2,
      evaluationsByDay: [
        { date: '2023-05-01', count: 3 },
        { date: '2023-05-02', count: 2 },
        { date: '2023-05-03', count: 5 },
        { date: '2023-05-04', count: 1 },
        { date: '2023-05-05', count: 4 },
        { date: '2023-05-06', count: 2 },
        { date: '2023-05-07', count: 8 }
      ],
      scoreDistribution: [
        { score: 1, count: 0 },
        { score: 2, count: 1 },
        { score: 3, count: 1 },
        { score: 4, count: 2 },
        { score: 5, count: 3 },
        { score: 6, count: 4 },
        { score: 7, count: 5 },
        { score: 8, count: 6 },
        { score: 9, count: 2 },
        { score: 10, count: 1 }
      ]
    },
    criteriaStats: {
      clarity: {
        averageScore: 7.5,
        distribution: [
          { score: 5, count: 2 },
          { score: 6, count: 3 },
          { score: 7, count: 5 },
          { score: 8, count: 10 },
          { score: 9, count: 4 },
          { score: 10, count: 1 }
        ]
      },
      completeness: {
        averageScore: 6.8,
        distribution: [
          { score: 4, count: 1 },
          { score: 5, count: 3 },
          { score: 6, count: 5 },
          { score: 7, count: 8 },
          { score: 8, count: 6 },
          { score: 9, count: 2 }
        ]
      }
    },
    assigneeStats: {
      user1: {
        averageScore: 7.6,
        evaluationCount: 15,
        criteriaScores: {
          clarity: 8.1,
          completeness: 7.5,
          reproducibility: 7.9,
          documentation: 6.8,
          testCoverage: 7.2,
          codeQuality: 7.8,
          efficiency: 7.7,
          adherence: 8.0
        }
      },
      user2: {
        averageScore: 6.9,
        evaluationCount: 10,
        criteriaScores: {
          clarity: 7.2,
          completeness: 6.5,
          reproducibility: 7.0,
          documentation: 6.2,
          testCoverage: 6.8,
          codeQuality: 7.3,
          efficiency: 6.9,
          adherence: 7.2
        }
      }
    },
    rawData: MOCK_EVALUATIONS
  };
};

export const exportData = async (filters: AnalyticsFilter, format: ExportFormat): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would generate and download an export file
  console.log(`Exporting data in ${format} format with filters:`, filters);
  
  // Since we can't actually download a file in this mock environment, 
  // just log a message
  alert(`Data would be exported in ${format} format in the real app`);
};
