
// Add Jira Forge Application Properties (AP) global interface
interface AP {
  context: {
    getToken: (callback: (token: string) => void) => void;
    getContext: (callback: (context: any) => void) => void;
  };
  request: (options: {
    url: string;
    type: string;
    contentType?: string;
    data?: string;
  }) => Promise<{
    body: string;
    status: number;
  }>;
}

// Add to the Window interface
interface Window {
  AP?: AP;
}
