
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AnalyticsFilter, AnalyticsData, ExportFormat } from '@/types';
import { getAnalyticsData, exportData } from '@/services';
import OverviewTab from './analytics/OverviewTab';
import CriteriaTab from './analytics/CriteriaTab';
import AssigneeTab from './analytics/AssigneeTab';
import DataTab from './analytics/DataTab';

const defaultFilters: AnalyticsFilter = {
  dateRange: [null, null],
  assignees: [],
  evaluators: [],
  ticketTypes: [],
  projects: [],
  criteriaScoreRanges: {}
};

const AnalyticsDashboard: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilter>(defaultFilters);
  const [activeTab, setActiveTab] = useState('overview');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');
  
  useEffect(() => {
    loadAnalyticsData();
  }, []);
  
  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const data = await getAnalyticsData(filters);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = async () => {
    try {
      await exportData(filters, exportFormat);
      toast({
        title: 'Export Started',
        description: `Your data is being exported in ${exportFormat} format.`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Ticket Quality Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select 
            value={exportFormat} 
            onValueChange={(value) => setExportFormat(value as ExportFormat)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Export As" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF Report</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine the analytics data display</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date-range">Date Range</Label>
            <Select disabled>
              <SelectTrigger id="date-range">
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="assignees">Assignees</Label>
            <Select disabled>
              <SelectTrigger id="assignees">
                <SelectValue placeholder="All assignees" />
              </SelectTrigger>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="projects">Projects</Label>
            <Select disabled>
              <SelectTrigger id="projects">
                <SelectValue placeholder="All projects" />
              </SelectTrigger>
            </Select>
          </div>
          
          <div className="md:col-span-3">
            <Button 
              onClick={loadAnalyticsData} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : analyticsData ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="criteria">By Criteria</TabsTrigger>
            <TabsTrigger value="assignee">By Assignee</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <OverviewTab data={analyticsData.overviewStats} />
          </TabsContent>
          
          <TabsContent value="criteria" className="pt-4">
            <CriteriaTab data={analyticsData.criteriaStats} />
          </TabsContent>
          
          <TabsContent value="assignee" className="pt-4">
            <AssigneeTab data={analyticsData.assigneeStats} />
          </TabsContent>
          
          <TabsContent value="data" className="pt-4">
            <DataTab data={analyticsData.rawData} />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No analytics data available.</p>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
