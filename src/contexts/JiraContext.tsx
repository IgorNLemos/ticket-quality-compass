
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { view } from '@forge/bridge';

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
  moduleKey: string | null;
  error: Error | null;
}

const JiraContext = createContext<JiraContextType>({
  isJira: false,
  isLoading: true,
  currentUser: null,
  contextIssueId: null,
  moduleKey: null,
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
  const [moduleKey, setModuleKey] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeJiraContext = async () => {
      try {
        setIsLoading(true);
        
        // Check if we're in a Forge environment
        const inJira = typeof window !== 'undefined' && (Boolean(window.AP) || Boolean(window.ForgeData));
        setIsJira(inJira);
        
        try {
          // Use @forge/bridge to get context
          const context = await view.getContext();
          console.log('Context from @forge/bridge:', context);
          
          if (context && context.moduleKey) {
            setModuleKey(context.moduleKey);
            console.log('Module key from Forge bridge:', context.moduleKey);
            
            // If we have issue context, set it
            if (context.extension && context.extension.issue && context.extension.issue.id) {
              setContextIssueId(context.extension.issue.id);
              console.log('Issue ID from context:', context.extension.issue.id);
            }
          }
        } catch (bridgeErr) {
          console.warn('Unable to get context from @forge/bridge:', bridgeErr);
          
          // Fallback to ForgeData if bridge fails
          try {
            if (window.ForgeData?.data?.moduleKey) {
              setModuleKey(window.ForgeData.data.moduleKey);
              console.log('Module key from ForgeData fallback:', window.ForgeData.data.moduleKey);
            }
          } catch (forgeDataErr) {
            console.warn('Unable to get ForgeData moduleKey:', forgeDataErr);
          }
          
          // Development fallbacks for easier testing
          if (!moduleKey) {
            if (window.location.search.includes('panel=true')) {
              setModuleKey('ticket-evaluation-panel');
              console.log('Using issue panel module key from URL parameter');
            } else if (window.location.search.includes('admin=true')) {
              setModuleKey('ticket-evaluation-dashboard');
              console.log('Using admin dashboard module key from URL parameter');
            } else {
              // Default to admin view for local development
              setModuleKey('ticket-evaluation-dashboard');
              console.log('Setting default module key for development');
            }
          }
        }
        
        if (!inJira) {
          // Not in Jira, set to development mode
          console.log('Not running in Jira environment, setting development mode');
          setIsLoading(false);
          return;
        }
        
        // Initialize the Jira AP client if available
        if (window.AP) {
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
        } else {
          setIsLoading(false);
        }
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
    moduleKey,
    error
  };

  return (
    <JiraContext.Provider value={value}>
      {children}
    </JiraContext.Provider>
  );
};
