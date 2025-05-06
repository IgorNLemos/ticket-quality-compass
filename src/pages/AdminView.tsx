
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CriteriaManager from '@/components/admin/CriteriaManager';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { EvaluationCriteria } from '@/types';
import { getEvaluationCriteria } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AdminView: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics');
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadCriteria = async () => {
      try {
        setIsLoading(true);
        const criteriaData = await getEvaluationCriteria();
        setCriteria(criteriaData);
      } catch (error) {
        console.error('Error loading criteria:', error);
        toast({
          title: 'Error',
          description: 'Failed to load evaluation criteria. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCriteria();
  }, [toast]);
  
  const handleSaveCriteria = (updatedCriteria: EvaluationCriteria[]) => {
    // In a real app, this would call an API to save the criteria
    setCriteria(updatedCriteria);
    console.log('Criteria saved:', updatedCriteria);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Ticket Quality Compass</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="configuration">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Configuration</h2>
            <CriteriaManager 
              criteria={criteria} 
              onSave={handleSaveCriteria} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminView;
