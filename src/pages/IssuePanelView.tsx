
import React, { useState } from 'react';
import EvaluationForm from '@/components/evaluation/EvaluationForm';
import EvaluationHistory from '@/components/evaluation/EvaluationHistory';

const IssuePanelView: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // In a real Forge app, this would come from the context or URL
  const mockTicketId = '12345';
  
  return (
    <div className="p-4">
      <EvaluationForm 
        ticketId={mockTicketId} 
        onHistoryClick={() => setIsHistoryOpen(true)} 
      />
      
      <EvaluationHistory 
        ticketId={mockTicketId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};

export default IssuePanelView;
