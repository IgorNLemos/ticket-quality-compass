
import { EvaluationCriteria } from '../types';
import { STORAGE_KEYS, USE_MOCK_DATA } from './utils/storageUtils';
import { DEFAULT_CRITERIA } from './utils/mockData';

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
