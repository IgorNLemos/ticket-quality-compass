
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface CriteriaStats {
  [criteriaId: string]: {
    averageScore: number;
    distribution: Array<{ score: number; count: number }>;
  };
}

interface CriteriaTabProps {
  data: CriteriaStats;
}

const CriteriaTab: React.FC<CriteriaTabProps> = ({ data }) => {
  // Transform data for comparison chart
  const comparisonData = Object.entries(data).map(([id, stats]) => ({
    name: formatCriteriaName(id),
    score: stats.averageScore,
  }));

  function formatCriteriaName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criteria Comparison</CardTitle>
          <CardDescription>Average scores across different criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={comparisonData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 10]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip 
                formatter={(value) => [`${value}/10`, 'Score']}
              />
              <Legend />
              <Bar 
                dataKey="score" 
                name="Average Score" 
                fill="#00B8D9" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution by Criteria</CardTitle>
          <CardDescription>Detailed view of each criterion</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(data)[0]}>
            <TabsList className="w-full flex-wrap h-auto">
              {Object.keys(data).map(criteriaId => (
                <TabsTrigger 
                  key={criteriaId} 
                  value={criteriaId}
                  className="mb-1 truncate max-w-[150px]"
                >
                  {formatCriteriaName(criteriaId)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(data).map(([criteriaId, stats]) => (
              <TabsContent key={criteriaId} value={criteriaId} className="pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{formatCriteriaName(criteriaId)}</h3>
                    <p className="text-sm text-muted-foreground">
                      Distribution of scores for this criterion
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-baseline">
                    <span className="text-3xl font-bold text-atlaskit-teal">
                      {stats.averageScore.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground ml-1">/10 avg</span>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={stats.distribution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="score" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} evaluations`, 'Count']}
                      labelFormatter={(value) => `Score: ${value}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Evaluations" 
                      fill="#36B37E" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CriteriaTab;
