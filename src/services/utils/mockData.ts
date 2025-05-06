
import { TicketMetadata, EvaluationCriteria, TicketEvaluation } from '../../types';

// Default criteria if none are configured
export const DEFAULT_CRITERIA: EvaluationCriteria[] = [
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

// Mock ticket data
export const getMockTicketData = (ticketId: string): TicketMetadata => {
  return {
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
};

// Mock evaluation data
export const MOCK_EVALUATIONS: TicketEvaluation[] = [
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
