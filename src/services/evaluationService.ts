
import { TicketEvaluation, EvaluationHistory } from '../types';
import { STORAGE_KEYS, USE_MOCK_DATA, calculateAverage } from './utils/storageUtils';
import { MOCK_EVALUATIONS } from './utils/mockData';
import { getCurrentUser } from './ticketService';

/**
 * Get all evaluations from Forge storage
 */
export const getAllEvaluations = async (): Promise<TicketEvaluation[]> => {
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
 * Get existing evaluation for a ticket
 */
export const getExistingEvaluation = async (ticketId: string): Promise<TicketEvaluation | null> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
