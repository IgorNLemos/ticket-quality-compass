
import { TicketMetadata } from '../types';
import { isRunningInJira, USE_MOCK_DATA } from './utils/storageUtils';
import { getMockTicketData } from './utils/mockData';

/**
 * Get the Jira issue data for a specific ticket
 */
export const getTicketData = async (ticketId: string): Promise<TicketMetadata> => {
  // If not in Jira or mock data is forced, return mock data
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock data
    return getMockTicketData(ticketId);
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
 * Get current user info from Jira
 */
export const getCurrentUser = async () => {
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
