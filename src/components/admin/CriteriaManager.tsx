
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EvaluationCriteria } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash, ArrowUp, ArrowDown } from 'lucide-react';

interface CriteriaManagerProps {
  criteria: EvaluationCriteria[];
  isLoading?: boolean;
  onSave: (criteria: EvaluationCriteria[]) => void;
}

const CriteriaManager: React.FC<CriteriaManagerProps> = ({
  criteria: initialCriteria,
  isLoading = false,
  onSave,
}) => {
  const { toast } = useToast();
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>(initialCriteria);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddCriteria = () => {
    const newCriteria: EvaluationCriteria = {
      id: `criteria_${Date.now()}`,
      name: 'New Criteria',
      description: 'Description of this evaluation criteria',
      required: true,
      defaultValue: 5,
    };
    
    setCriteria([...criteria, newCriteria]);
    setEditingIndex(criteria.length);
  };

  const handleRemoveCriteria = (index: number) => {
    const newCriteria = [...criteria];
    newCriteria.splice(index, 1);
    setCriteria(newCriteria);
    toast({
      title: 'Criteria Removed',
      description: 'The evaluation criteria has been removed.',
    });
  };

  const handleMoveCriteria = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === criteria.length - 1)
    ) {
      return;
    }

    const newCriteria = [...criteria];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newCriteria[index], newCriteria[targetIndex]] = [newCriteria[targetIndex], newCriteria[index]];
    
    setCriteria(newCriteria);
  };

  const handleUpdateCriteria = (index: number, field: keyof EvaluationCriteria, value: any) => {
    const newCriteria = [...criteria];
    newCriteria[index] = {
      ...newCriteria[index],
      [field]: value,
    };
    
    setCriteria(newCriteria);
  };

  const handleSave = () => {
    onSave(criteria);
    toast({
      title: 'Criteria Saved',
      description: 'Your changes to the evaluation criteria have been saved.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Criteria</CardTitle>
        <CardDescription>
          Configure the criteria used to evaluate tickets
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {criteria.map((criterion, index) => (
          <div key={criterion.id} className="border rounded-md p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h4 className="font-medium">{criterion.name}</h4>
                <p className="text-sm text-muted-foreground">{criterion.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveCriteria(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveCriteria(index, 'down')}
                  disabled={index === criteria.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleRemoveCriteria(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {editingIndex === index ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor={`name-${index}`}>Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={criterion.name}
                    onChange={(e) => handleUpdateCriteria(index, 'name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`desc-${index}`}>Description</Label>
                  <Textarea
                    id={`desc-${index}`}
                    value={criterion.description}
                    onChange={(e) => handleUpdateCriteria(index, 'description', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={`default-${index}`}>Default Value (1-10)</Label>
                    <Input
                      id={`default-${index}`}
                      type="number"
                      min="1"
                      max="10"
                      value={criterion.defaultValue}
                      onChange={(e) => handleUpdateCriteria(index, 'defaultValue', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-5">
                    <Switch
                      id={`required-${index}`}
                      checked={criterion.required}
                      onCheckedChange={(checked) => handleUpdateCriteria(index, 'required', checked)}
                    />
                    <Label htmlFor={`required-${index}`}>Required</Label>
                  </div>
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => setEditingIndex(null)}
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingIndex(index)}
                >
                  Edit
                </Button>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Default: {criterion.defaultValue}/10</span>
                  <span>•</span>
                  <span>{criterion.required ? 'Required' : 'Optional'}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleAddCriteria}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Criteria
        </Button>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="ml-auto"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CriteriaManager;
