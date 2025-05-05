
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

interface OverviewStats {
  totalEvaluations: number;
  averageScore: number;
  evaluationsByDay: Array<{ date: string; count: number }>;
  scoreDistribution: Array<{ score: number; count: number }>;
}

interface OverviewTabProps {
  data: OverviewStats;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

  // Group scores for pie chart (1-3, 4-6, 7-8, 9-10)
  const groupedScores = [
    { name: 'Low (1-3)', value: 0 },
    { name: 'Medium (4-6)', value: 0 },
    { name: 'Good (7-8)', value: 0 },
    { name: 'Excellent (9-10)', value: 0 },
  ];

  data.scoreDistribution.forEach(item => {
    if (item.score <= 3) {
      groupedScores[0].value += item.count;
    } else if (item.score <= 6) {
      groupedScores[1].value += item.count;
    } else if (item.score <= 8) {
      groupedScores[2].value += item.count;
    } else {
      groupedScores[3].value += item.count;
    }
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Evaluations</CardTitle>
            <CardDescription>Number of ticket evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-atlaskit-blue">{data.totalEvaluations}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
            <CardDescription>Across all evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-atlaskit-green">
              {data.averageScore.toFixed(1)}<span className="text-base text-muted-foreground">/10</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Score Distribution</CardTitle>
            <CardDescription>Range of evaluation scores</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={groupedScores}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {groupedScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Evaluations Over Time</CardTitle>
          <CardDescription>Number of ticket evaluations per day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data.evaluationsByDay}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} evaluations`, 'Count']}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Evaluations"
                stroke="#0052CC"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Number of evaluations by score</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.scoreDistribution}
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
                fill="#6554C0" 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
