
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TicketEvaluation } from '@/types';
import { getEvaluationHistory } from '@/services/apiService';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface EvaluationHistoryProps {
  ticketId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EvaluationHistory: React.FC<EvaluationHistoryProps> = ({ 
  ticketId, 
  isOpen, 
  onClose 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<TicketEvaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<TicketEvaluation | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (!isOpen) return;

      try {
        setIsLoading(true);
        const response = await getEvaluationHistory(ticketId);
        setHistory(response.evaluations);
      } catch (error) {
        console.error('Error loading evaluation history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load evaluation history. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [ticketId, isOpen, toast]);

  const handleViewDetails = (evaluation: TicketEvaluation) => {
    setSelectedEvaluation(evaluation);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Evaluation History</DialogTitle>
          <DialogDescription>
            Previous evaluations for this ticket
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No evaluation history found for this ticket.
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Evaluator</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{formatDate(evaluation.timestamp)}</TableCell>
                    <TableCell>{evaluation.evaluatorDisplayName}</TableCell>
                    <TableCell className="text-center font-medium">
                      {evaluation.averageScore.toFixed(1)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(evaluation)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        {selectedEvaluation && (
          <div className="border rounded-md p-4 mt-4">
            <h3 className="font-medium mb-2">
              Evaluation from {formatDate(selectedEvaluation.timestamp)}
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(selectedEvaluation.criteria).map(([id, score]) => (
                <div key={id} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="font-medium">{score}/10</span>
                </div>
              ))}
            </div>
            
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Feedback:</h4>
              <p className="text-sm whitespace-pre-wrap p-2 bg-muted/50 rounded">
                {selectedEvaluation.feedback || 'No feedback provided'}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationHistory;
