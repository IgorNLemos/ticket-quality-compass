
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface JiraUser {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

interface JiraContextType {
  isJira: boolean;
  isLoading: boolean;
  currentUser: JiraUser | null;
  contextIssueId: string | null;
  error: Error | null;
}

const JiraContext = createContext<JiraContextType>({
  isJira: false,
  isLoading: true,
  currentUser: null,
  contextIssueId: null,
  error: null
});

export const useJira = () => useContext(JiraContext);

interface JiraProviderProps {
  children: ReactNode;
}

export const JiraProvider: React.FC<JiraProviderProps> = ({ children }) => {
  const [isJira, setIsJira] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<JiraUser | null>(null);
  const [contextIssueId, setContextIssueId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeJiraContext = async () => {
      try {
        setIsLoading(true);
        
        // Check if running in Jira
        const inJira = typeof window !== 'undefined' && Boolean(window.AP);
        setIsJira(inJira);
        
        if (!inJira) {
          // Not in Jira, set to development mode
          setIsLoading(false);
          return;
        }
        
        // Initialize the Jira AP client
        window.AP.context.getToken(async (token: string) => {
          // Get the current issue context
          window.AP.context.getContext(async (context: any) => {
            if (context && context.issueId) {
              setContextIssueId(context.issueId);
            }
            
            try {
              // Get current user
              const response = await window.AP.request({
                url: '/rest/api/3/myself',
                type: 'GET'
              });
              
              const userData = JSON.parse(response.body);
              
              setCurrentUser({
                id: userData.accountId,
                displayName: userData.displayName,
                avatarUrl: userData.avatarUrls['24x24']
              });
            } catch (err) {
              console.error('Error fetching current user:', err);
              setError(err instanceof Error ? err : new Error('Failed to fetch user data'));
            } finally {
              setIsLoading(false);
            }
          });
        });
      } catch (err) {
        console.error('Error initializing Jira context:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize Jira context'));
        setIsLoading(false);
      }
    };
    
    initializeJiraContext();
  }, []);

  const value = {
    isJira,
    isLoading,
    currentUser,
    contextIssueId,
    error
  };

  return (
    <JiraContext.Provider value={value}>
      {children}
    </JiraContext.Provider>
  );
};
