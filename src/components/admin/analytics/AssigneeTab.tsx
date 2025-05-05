
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

interface AssigneeStats {
  [assigneeId: string]: {
    averageScore: number;
    evaluationCount: number;
    criteriaScores: {
      [criteriaId: string]: number;
    };
  };
}

interface AssigneeTabProps {
  data: AssigneeStats;
}

const AssigneeTab: React.FC<AssigneeTabProps> = ({ data }) => {
  // Transform data for comparison chart
  const comparisonData = Object.entries(data).map(([id, stats]) => ({
    name: id,
    score: stats.averageScore,
    evaluations: stats.evaluationCount,
  }));

  // Format criteria names
  const formatCriteriaName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // Get radar data for a specific assignee
  const getRadarData = (assigneeId: string) => {
    const assignee = data[assigneeId];
    if (!assignee) return [];

    return Object.entries(assignee.criteriaScores).map(([criteriaId, score]) => ({
      subject: formatCriteriaName(criteriaId),
      A: score,
      fullMark: 10,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assignee Performance</CardTitle>
          <CardDescription>Average ticket quality score by assignee</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={comparisonData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'score' ? `${value}/10` : value,
                  name === 'score' ? 'Score' : 'Evaluations'
                ]}
              />
              <Legend />
              <Bar 
                dataKey="score" 
                name="Average Score" 
                fill="#FF5630" 
              />
              <Bar 
                dataKey="evaluations" 
                name="Number of Evaluations" 
                fill="#FFAB00" 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(data).map(([assigneeId, stats]) => (
          <Card key={assigneeId}>
            <CardHeader>
              <CardTitle className="text-lg">{assigneeId}</CardTitle>
              <CardDescription>
                {stats.evaluationCount} evaluations, {stats.averageScore.toFixed(1)}/10 average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={getRadarData(assigneeId)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 10]} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#6554C0"
                    fill="#6554C0"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssigneeTab;
