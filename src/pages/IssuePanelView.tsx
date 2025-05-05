
import React, { useState } from 'react';
import EvaluationForm from '@/components/evaluation/EvaluationForm';
import EvaluationHistory from '@/components/evaluation/EvaluationHistory';
import { useJira } from '@/contexts/JiraContext';
import { Loader2 } from 'lucide-react';

const IssuePanelView: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { isLoading, contextIssueId, isJira } = useJira();
  
  // Use the context issue ID if available, otherwise fallback to mock ID
  const ticketId = contextIssueId || '12345';
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="p-4">
      {!isJira && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm">
          Running in development mode with mock data. Connect to Jira to use real data.
        </div>
      )}
      
      <EvaluationForm 
        ticketId={ticketId} 
        onHistoryClick={() => setIsHistoryOpen(true)} 
      />
      
      <EvaluationHistory 
        ticketId={ticketId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};

export default IssuePanelView;
