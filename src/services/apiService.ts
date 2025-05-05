
import { TicketMetadata, TicketEvaluation, EvaluationCriteria, EvaluationHistory, AnalyticsData, AnalyticsFilter, ExportFormat } from '../types';

// Local storage keys for Forge storage
const STORAGE_KEYS = {
  EVALUATIONS: 'ticket-evaluations',
  CRITERIA: 'evaluation-criteria'
};

// Default criteria if none are configured
const DEFAULT_CRITERIA: EvaluationCriteria[] = [
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

// Using environment flag to switch between mock and real data
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && !window.AP;

// Function to determine if we're running in Jira
const isRunningInJira = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.AP);
};

/**
 * Get the Jira issue data for a specific ticket
 */
export const getTicketData = async (ticketId: string): Promise<TicketMetadata> => {
  // If not in Jira or mock data is forced, return mock data
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock data
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
  }

  try {
    // Use Forge API to get issue data
    const issue = await window.AP.request({
      url: `/rest/api/3/issue/${ticketId}`,
      type: 'GET'
    });

    const issueData = JSON.parse(issue.body);

    // Extract and format the data
    return {
      id: issueData.id,
      key: issueData.key,
      summary: issueData.fields.summary,
      assignee: issueData.fields.assignee ? {
        id: issueData.fields.assignee.accountId,
        displayName: issueData.fields.assignee.displayName,
        avatarUrl: issueData.fields.assignee.avatarUrls['24x24']
      } : {
        id: 'unassigned',
        displayName: 'Unassigned',
        avatarUrl: undefined
      },
      reporter: {
        id: issueData.fields.reporter.accountId,
        displayName: issueData.fields.reporter.displayName,
        avatarUrl: issueData.fields.reporter.avatarUrls['24x24']
      },
      status: issueData.fields.status.name,
      type: issueData.fields.issuetype.name,
      priority: issueData.fields.priority ? issueData.fields.priority.name : 'None',
      created: issueData.fields.created,
      updated: issueData.fields.updated
    };
  } catch (error) {
    console.error('Error fetching issue data:', error);
    throw new Error('Failed to fetch issue data');
  }
};

/**
 * Get evaluation criteria from Forge storage
 */
export const getEvaluationCriteria = async (): Promise<EvaluationCriteria[]> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return DEFAULT_CRITERIA;
  }

  try {
    // Try to get criteria from Forge storage
    const storage = await window.AP.request({
      url: `/rest/api/forge/storage/get/${STORAGE_KEYS.CRITERIA}`,
      type: 'GET'
    }).catch(() => null);

    if (storage && storage.body) {
      return JSON.parse(storage.body);
    }

    // If no criteria exist, set the defaults and return them
    await window.AP.request({
      url: `/rest/api/forge/storage/set/${STORAGE_KEYS.CRITERIA}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(DEFAULT_CRITERIA)
    });

    return DEFAULT_CRITERIA;
  } catch (error) {
    console.error('Error fetching criteria:', error);
    return DEFAULT_CRITERIA;
  }
};

/**
 * Get existing evaluation for a ticket
 */
export const getExistingEvaluation = async (ticketId: string): Promise<TicketEvaluation | null> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock evaluation data
    const MOCK_EVALUATIONS = [
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
    
    // Find existing evaluation for this ticket
    const evaluation = MOCK_EVALUATIONS.find(item => item.ticketId === ticketId);
    return evaluation || null;
  }

  try {
    // Get all evaluations
    const evaluations = await getAllEvaluations();
    
    // Find evaluation for this specific ticket
    return evaluations.find(evaluation => evaluation.ticketId === ticketId) || null;
  } catch (error) {
    console.error('Error fetching existing evaluation:', error);
    return null;
  }
};

/**
 * Get all evaluations from Forge storage
 */
const getAllEvaluations = async (): Promise<TicketEvaluation[]> => {
  if (USE_MOCK_DATA) return [];

  try {
    const storage = await window.AP.request({
      url: `/rest/api/forge/storage/get/${STORAGE_KEYS.EVALUATIONS}`,
      type: 'GET'
    }).catch(() => null);

    if (storage && storage.body) {
      return JSON.parse(storage.body);
    }
    return [];
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return [];
  }
};

/**
 * Get evaluation history for a ticket
 */
export const getEvaluationHistory = async (
  ticketId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<EvaluationHistory> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock evaluation data
    const MOCK_EVALUATIONS = [
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
    
    // Filter evaluations for this ticket
    const evaluations = MOCK_EVALUATIONS.filter(item => item.ticketId === ticketId);
    
    return {
      evaluations: evaluations.slice((page - 1) * pageSize, page * pageSize),
      totalCount: evaluations.length
    };
  }

  try {
    // Get all evaluations
    const allEvaluations = await getAllEvaluations();
    
    // Filter for the specified ticket
    const ticketEvaluations = allEvaluations.filter(
      evaluation => evaluation.ticketId === ticketId
    );
    
    // Sort by timestamp (newest first)
    ticketEvaluations.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return {
      evaluations: ticketEvaluations.slice((page - 1) * pageSize, page * pageSize),
      totalCount: ticketEvaluations.length
    };
  } catch (error) {
    console.error('Error fetching evaluation history:', error);
    return { evaluations: [], totalCount: 0 };
  }
};

/**
 * Save evaluation to Forge storage
 */
export const saveEvaluation = async (evaluation: Partial<TicketEvaluation>): Promise<TicketEvaluation> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock implementation
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
    
    return newEvaluation;
  }

  try {
    // Get current user info
    const currentUser = await getCurrentUser();
    
    // Get all existing evaluations
    const evaluations = await getAllEvaluations();
    
    // Check if this is a new evaluation or an update
    const isNewEvaluation = !evaluation.id;
    
    // Create or update evaluation
    const newEvaluation: TicketEvaluation = {
      id: evaluation.id || `eval-${Date.now()}`,
      ticketId: evaluation.ticketId || '',
      ticketKey: evaluation.ticketKey || '',
      evaluatorId: currentUser.id,
      evaluatorDisplayName: currentUser.displayName,
      timestamp: new Date().toISOString(),
      criteria: evaluation.criteria || {},
      averageScore: evaluation.averageScore || 0,
      feedback: evaluation.feedback || '',
      version: evaluation.version ? evaluation.version + 1 : 1
    };
    
    // Calculate average score if not provided
    if (!evaluation.averageScore) {
      const scores = Object.values(newEvaluation.criteria);
      newEvaluation.averageScore = scores.length 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 0;
    }
    
    if (isNewEvaluation) {
      evaluations.push(newEvaluation);
    } else {
      const index = evaluations.findIndex(item => item.id === newEvaluation.id);
      if (index >= 0) {
        evaluations[index] = newEvaluation;
      } else {
        evaluations.push(newEvaluation);
      }
    }
    
    // Save to Forge storage
    await window.AP.request({
      url: `/rest/api/forge/storage/set/${STORAGE_KEYS.EVALUATIONS}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(evaluations)
    });
    
    return newEvaluation;
  } catch (error) {
    console.error('Error saving evaluation:', error);
    throw new Error('Failed to save evaluation');
  }
};

/**
 * Get current user info from Jira
 */
const getCurrentUser = async () => {
  if (USE_MOCK_DATA) {
    return {
      id: 'currentUser',
      displayName: 'Current User',
      avatarUrl: ''
    };
  }

  try {
    const response = await window.AP.request({
      url: '/rest/api/3/myself',
      type: 'GET'
    });
    
    const userData = JSON.parse(response.body);
    
    return {
      id: userData.accountId,
      displayName: userData.displayName,
      avatarUrl: userData.avatarUrls['24x24']
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw new Error('Failed to get current user information');
  }
};

/**
 * Get analytics data
 */
export const getAnalyticsData = async (filters: AnalyticsFilter): Promise<AnalyticsData> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Return mock analytics data
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
      rawData: []
    };
  }

  try {
    // Get all evaluations
    const allEvaluations = await getAllEvaluations();
    
    // Apply filters if any
    let filteredEvaluations = [...allEvaluations];
    
    // Process data for analytics
    const scoreDistribution: Record<number, number> = {};
    const evaluationsByDay: Record<string, number> = {};
    const criteriaStats: Record<string, { scores: number[], distribution: Record<number, number> }> = {};
    const assigneeStats: Record<string, { 
      scores: number[],
      evaluations: number,
      criteriaScores: Record<string, number[]>
    }> = {};
    
    // Initialize score distribution
    for (let i = 1; i <= 10; i++) {
      scoreDistribution[i] = 0;
    }
    
    // Process each evaluation
    filteredEvaluations.forEach(evaluation => {
      // Score distribution
      const roundedScore = Math.round(evaluation.averageScore);
      scoreDistribution[roundedScore] = (scoreDistribution[roundedScore] || 0) + 1;
      
      // Evaluations by day
      const date = evaluation.timestamp.split('T')[0];
      evaluationsByDay[date] = (evaluationsByDay[date] || 0) + 1;
      
      // Criteria stats
      for (const [criteriaId, score] of Object.entries(evaluation.criteria)) {
        if (!criteriaStats[criteriaId]) {
          criteriaStats[criteriaId] = { scores: [], distribution: {} };
          for (let i = 1; i <= 10; i++) {
            criteriaStats[criteriaId].distribution[i] = 0;
          }
        }
        criteriaStats[criteriaId].scores.push(score);
        criteriaStats[criteriaId].distribution[score] = 
          (criteriaStats[criteriaId].distribution[score] || 0) + 1;
      }
      
      // Assignee stats
      const assigneeId = evaluation.ticketId;  // Using ticket ID as a proxy for assignee
      if (!assigneeStats[assigneeId]) {
        assigneeStats[assigneeId] = { 
          scores: [], 
          evaluations: 0,
          criteriaScores: {}
        };
      }
      
      assigneeStats[assigneeId].scores.push(evaluation.averageScore);
      assigneeStats[assigneeId].evaluations++;
      
      for (const [criteriaId, score] of Object.entries(evaluation.criteria)) {
        if (!assigneeStats[assigneeId].criteriaScores[criteriaId]) {
          assigneeStats[assigneeId].criteriaScores[criteriaId] = [];
        }
        assigneeStats[assigneeId].criteriaScores[criteriaId].push(score);
      }
    });
    
    // Format the results
    const formatAnalyticsData: AnalyticsData = {
      overviewStats: {
        totalEvaluations: filteredEvaluations.length,
        averageScore: calculateAverage(filteredEvaluations.map(e => e.averageScore)),
        evaluationsByDay: Object.entries(evaluationsByDay).map(([date, count]) => ({ 
          date, count 
        })),
        scoreDistribution: Object.entries(scoreDistribution).map(([score, count]) => ({
          score: parseInt(score),
          count
        }))
      },
      criteriaStats: {},
      assigneeStats: {},
      rawData: filteredEvaluations
    };
    
    // Format criteria stats
    for (const [criteriaId, data] of Object.entries(criteriaStats)) {
      formatAnalyticsData.criteriaStats[criteriaId] = {
        averageScore: calculateAverage(data.scores),
        distribution: Object.entries(data.distribution)
          .filter(([_, count]) => count > 0)
          .map(([score, count]) => ({
            score: parseInt(score),
            count
          }))
      };
    }
    
    // Format assignee stats
    for (const [assigneeId, data] of Object.entries(assigneeStats)) {
      const criteriaScores: Record<string, number> = {};
      
      for (const [criteriaId, scores] of Object.entries(data.criteriaScores)) {
        criteriaScores[criteriaId] = calculateAverage(scores);
      }
      
      formatAnalyticsData.assigneeStats[assigneeId] = {
        averageScore: calculateAverage(data.scores),
        evaluationCount: data.evaluations,
        criteriaScores
      };
    }
    
    return formatAnalyticsData;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw new Error('Failed to get analytics data');
  }
};

// Utility function to calculate average
const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

export const exportData = async (filters: AnalyticsFilter, format: ExportFormat): Promise<void> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(`Exporting data in ${format} format with filters:`, filters);
    alert(`Data would be exported in ${format} format in the real app`);
    return;
  }

  try {
    // Get the data
    const data = await getAnalyticsData(filters);
    
    // Format for export
    let exportContent = '';
    let fileName = `ticket-evaluations-export-${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'csv':
        exportContent = convertToCSV(data.rawData);
        fileName += '.csv';
        break;
      case 'excel':
        // In a real implementation, this would use a library to create Excel files
        alert('Excel export would be implemented with a proper Excel generation library');
        return;
      case 'pdf':
        // In a real implementation, this would use a library to create PDF files
        alert('PDF export would be implemented with a proper PDF generation library');
        return;
      default:
        exportContent = JSON.stringify(data.rawData, null, 2);
        fileName += '.json';
    }
    
    // Create download link
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

// Convert data to CSV format
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(item => {
    return Object.values(item).map(value => {
      // Handle complex objects by stringifying
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Handle strings with commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
};
