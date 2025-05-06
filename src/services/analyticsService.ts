import { AnalyticsData, AnalyticsFilter, ExportFormat } from '../types';
import { USE_MOCK_DATA, calculateAverage, convertToCSV } from './utils/storageUtils';
import { getAllEvaluations } from './evaluationService';

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
    
    // Filter by date if dateRange is provided
    if (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1])) {
      filteredEvaluations = filteredEvaluations.filter(evaluation => {
        const evalDate = new Date(evaluation.timestamp);
        const startOk = !filters.dateRange[0] || evalDate >= filters.dateRange[0];
        const endOk = !filters.dateRange[1] || evalDate <= filters.dateRange[1];
        return startOk && endOk;
      });
    }

    // Filter by assignees if provided
    if (filters.assignees && filters.assignees.length > 0) {
      filteredEvaluations = filteredEvaluations.filter(evaluation => 
        filters.assignees.includes(evaluation.ticketId)
      );
    }

    // Filter by evaluators if provided
    if (filters.evaluators && filters.evaluators.length > 0) {
      filteredEvaluations = filteredEvaluations.filter(evaluation => 
        filters.evaluators.includes(evaluation.evaluatorId)
      );
    }
    
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
        evaluationsByDay: Object.entries(evaluationsByDay)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, count]) => ({ 
            date, 
            count 
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
    URL.revokeObjectURL(url);  // Fixed: Changed from revoObjectURL to revokeObjectURL
    
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};
