
// Local storage keys for Forge storage
export const STORAGE_KEYS = {
  EVALUATIONS: 'ticket-evaluations',
  CRITERIA: 'evaluation-criteria'
};

// Function to determine if we're running in Jira
export const isRunningInJira = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.AP);
};

// Using environment flag to switch between mock and real data
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && !window.AP;

// Utility function to calculate average
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

// Convert data to CSV format
export const convertToCSV = (data: any[]): string => {
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
