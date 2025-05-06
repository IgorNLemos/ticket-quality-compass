
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { TicketMetadata, TicketEvaluation, EvaluationCriteria } from '@/types';
import { getTicketData, getEvaluationCriteria, getExistingEvaluation, saveEvaluation } from '@/services';
import { Loader2 } from 'lucide-react';

interface EvaluationFormProps {
  ticketId: string;
  onHistoryClick?: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ ticketId, onHistoryClick }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [ticket, setTicket] = useState<TicketMetadata | null>(null);
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
  const [evaluation, setEvaluation] = useState<Partial<TicketEvaluation>>({
    ticketId: '',
    criteria: {},
    feedback: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch ticket data
        const ticketData = await getTicketData(ticketId);
        setTicket(ticketData);
        
        // Fetch evaluation criteria
        const criteriaData = await getEvaluationCriteria();
        setCriteria(criteriaData);
        
        // Initialize criteria with default values
        const defaultCriteria: { [key: string]: number } = {};
        criteriaData.forEach(criterion => {
          defaultCriteria[criterion.id] = criterion.defaultValue || 5;
        });
        
        // Check for existing evaluation
        const existingEvaluation = await getExistingEvaluation(ticketId);
        
        if (existingEvaluation) {
          setEvaluation(existingEvaluation);
        } else {
          setEvaluation({
            ticketId: ticketData.id,
            ticketKey: ticketData.key,
            criteria: defaultCriteria,
            feedback: '',
          });
        }
      } catch (error) {
        console.error('Error loading evaluation data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load evaluation data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [ticketId, toast]);

  const handleSliderChange = (criteriaId: string, value: number[]) => {
    setEvaluation(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [criteriaId]: value[0]
      }
    }));
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluation(prev => ({
      ...prev,
      feedback: e.target.value
    }));
  };

  const handleReset = () => {
    // Reset criteria to default values
    const defaultCriteria: { [key: string]: number } = {};
    criteria.forEach(criterion => {
      defaultCriteria[criterion.id] = criterion.defaultValue || 5;
    });
    
    setEvaluation(prev => ({
      ...prev,
      criteria: defaultCriteria,
      feedback: '',
    }));
    
    toast({
      title: 'Form Reset',
      description: 'Evaluation form has been reset to default values.',
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      
      // Calculate average score
      const scores = Object.values(evaluation.criteria || {});
      const averageScore = scores.length 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 0;
      
      // Prepare evaluation data
      const evaluationData: Partial<TicketEvaluation> = {
        ...evaluation,
        averageScore,
        evaluatorId: 'currentUser', // In a real app, get from Forge context
        evaluatorDisplayName: 'Current User', // In a real app, get from Forge context
      };
      
      // Save evaluation
      const savedEvaluation = await saveEvaluation(evaluationData);
      
      // Update local state with saved data
      setEvaluation(savedEvaluation);
      
      toast({
        title: 'Evaluation Saved',
        description: 'Your ticket evaluation has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast({
        title: 'Error',
        description: 'Failed to save evaluation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Ticket Evaluation</CardTitle>
            <CardDescription>
              Evaluate quality and completeness of this ticket
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {evaluation.id ? 'Updating' : 'New Evaluation'}
          </Badge>
        </div>
      </CardHeader>
      
      {ticket && (
        <CardContent className="space-y-6">
          {/* Ticket metadata */}
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Ticket</span>
                <h3 className="text-base font-semibold">{ticket.key}: {ticket.summary}</h3>
              </div>
              <Badge variant={
                ticket.status === 'Done' ? 'default' : 
                ticket.status === 'In Progress' ? 'secondary' : 
                'outline'
              }>
                {ticket.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Assignee:</span>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-1">
                    <AvatarImage src={ticket.assignee.avatarUrl} />
                    <AvatarFallback>{ticket.assignee.displayName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ticket.assignee.displayName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Type:</span>
                <span className="text-sm">{ticket.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Priority:</span>
                <span className="text-sm">{ticket.priority}</span>
              </div>
            </div>
          </div>
          
          {/* Evaluation criteria sliders */}
          <div className="space-y-5">
            <h3 className="font-medium text-base">Quality Assessment</h3>
            
            <div className="grid gap-6">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label 
                            htmlFor={`slider-${criterion.id}`} 
                            className="text-sm font-medium cursor-help flex items-center"
                          >
                            {criterion.name}
                            {criterion.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{criterion.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-sm font-medium">
                      {evaluation.criteria?.[criterion.id] || 5}/10
                    </span>
                  </div>
                  
                  <Slider
                    id={`slider-${criterion.id}`}
                    min={1}
                    max={10}
                    step={1}
                    value={[evaluation.criteria?.[criterion.id] || 5]}
                    onValueChange={(value) => handleSliderChange(criterion.id, value)}
                    className="atlaskit-slider"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feedback text area */}
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Additional Feedback
            </label>
            <Textarea
              id="feedback"
              placeholder="Provide detailed feedback on this ticket..."
              value={evaluation.feedback || ''}
              onChange={handleFeedbackChange}
              className="min-h-[100px]"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Be specific and constructive</span>
              <span>{evaluation.feedback?.length || 0} characters</span>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between pt-4">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            Reset
          </Button>
          {onHistoryClick && (
            <Button variant="secondary" onClick={onHistoryClick} disabled={isSaving}>
              View History
            </Button>
          )}
        </div>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Evaluation'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EvaluationForm;
