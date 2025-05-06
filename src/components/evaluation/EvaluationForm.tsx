import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  getTicketData,
  getEvaluationCriteria,
  getExistingEvaluation,
  saveEvaluation
} from '@/services';
import { TicketMetadata, EvaluationCriteria, TicketEvaluation } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';

interface EvaluationFormProps {
  ticketId: string;
  onHistoryClick: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ ticketId, onHistoryClick }) => {
  const { toast } = useToast();
  const [ticket, setTicket] = useState<TicketMetadata | null>(null);
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
  const [evaluation, setEvaluation] = useState<TicketEvaluation | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

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

        // Fetch existing evaluation
        const existingEvaluation = await getExistingEvaluation(ticketId);
        setEvaluation(existingEvaluation);

        // Initialize scores with existing evaluation or default values
        const initialScores: Record<string, number> = {};
        criteriaData.forEach(criterion => {
          initialScores[criterion.id] = existingEvaluation?.criteria[criterion.id] ?? criterion.defaultValue;
        });
        setScores(initialScores);
        setFeedback(existingEvaluation?.feedback ?? '');
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ticketId, toast]);

  const handleScoreChange = (criterionId: string, value: number) => {
    setScores(prevScores => ({
      ...prevScores,
      [criterionId]: value,
    }));
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const calculateAverageScore = () => {
    const validScores = Object.values(scores).filter(score => typeof score === 'number');
    if (validScores.length === 0) return 0;
    const sum = validScores.reduce((acc, score) => acc + score, 0);
    return sum / validScores.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      // Prepare evaluation data
      const averageScore = calculateAverageScore();
      const evaluationData: Partial<TicketEvaluation> = {
        id: evaluation?.id,
        ticketId: ticketId,
        ticketKey: ticket?.key || '',
        criteria: scores,
        averageScore: averageScore,
        feedback: feedback,
        version: evaluation?.version
      };

      // Save evaluation
      const savedEvaluation = await saveEvaluation(evaluationData);

      setEvaluation(savedEvaluation);
      toast({
        title: 'Success',
        description: 'Evaluation saved successfully.',
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
    <Card>
      <CardHeader>
        <CardTitle>Ticket Evaluation</CardTitle>
        <CardDescription>Evaluate ticket quality based on predefined criteria.</CardDescription>
      </CardHeader>
      <CardContent>
        {ticket ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{ticket.summary}</h3>
            <p className="text-sm text-muted-foreground">Ticket ID: {ticket.key}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Loading ticket information...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="grid gap-2">
              <Label htmlFor={criterion.id}>{criterion.name}</Label>
              <p className="text-sm text-muted-foreground">{criterion.description}</p>
              <Slider
                id={criterion.id}
                defaultValue={[scores[criterion.id]]}
                max={10}
                step={1}
                onValueChange={(value) => handleScoreChange(criterion.id, value[0])}
                aria-label={criterion.name}
              />
              <Input
                type="number"
                id={`${criterion.id}-value`}
                value={scores[criterion.id]}
                readOnly
                className="w-24"
              />
            </div>
          ))}

          <div>
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Enter your feedback here."
              value={feedback}
              onChange={handleFeedbackChange}
            />
          </div>

          <div className="flex justify-between">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Evaluation'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onHistoryClick}>
              View History
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EvaluationForm;
