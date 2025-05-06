
// Import from the new services structure
import { getAnalyticsData, exportData } from '@/services';
import { AnalyticsData, AnalyticsFilter, ExportFormat } from '@/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { CalendarIcon, ArrowDownToLine, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// Import from recharts instead of chart.js and react-chartjs-2
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilter>({
    dateRange: [null, null],
    assignees: [],
    evaluators: [],
    ticketTypes: [],
    projects: [],
    criteriaScoreRanges: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const data = await getAnalyticsData(filters);
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Handle error appropriately (e.g., show a toast)
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<AnalyticsFilter>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportData(filters, exportFormat);
    } catch (error) {
      console.error('Error exporting data:', error);
      // Handle error appropriately (e.g., show a toast)
    } finally {
      setExporting(false);
    }
  };

  // Prepare chart data
  const evaluationsByDayData = analyticsData?.overviewStats.evaluationsByDay.map(item => ({
    date: item.date,
    count: item.count
  })) || [];

  const scoreDistributionData = analyticsData?.overviewStats.scoreDistribution.map(item => ({
    score: item.score,
    count: item.count
  })) || [];

  const criteriaAverages = analyticsData?.criteriaStats ? Object.entries(analyticsData.criteriaStats).map(([criteria, data]) => ({
    criteria,
    averageScore: data.averageScore,
  })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="space-x-2">
          <DatePicker
            mode="range"
            defaultMonth={new Date()}
            onSelect={(date) => handleFilterChange({ 
              dateRange: date ? [date.from, date.to] : [null, null]
            })}
          />
          <Select onValueChange={(value) => handleFilterChange({ 
            projects: value === 'all' ? [] : [value]
          })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="category1">Category 1</SelectItem>
              <SelectItem value="category2">Category 2</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={exporting} onClick={handleExport}>
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                Export Data
                <ArrowDownToLine className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Select 
            onValueChange={(value) => setExportFormat(value as ExportFormat)}
            defaultValue={exportFormat}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Evaluations</CardTitle>
                <CardDescription>Number of evaluations submitted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.overviewStats.totalEvaluations}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Score</CardTitle>
                <CardDescription>Average score across all evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.overviewStats.averageScore?.toFixed(1)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Evaluations by Day</CardTitle>
                <CardDescription>Number of evaluations per day</CardDescription>
              </CardHeader>
              <CardContent>
                {evaluationsByDayData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={evaluationsByDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div>No data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Distribution of scores across all evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                {scoreDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="score" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div>No data available</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Criteria Averages</CardTitle>
                <CardDescription>Average score for each evaluation criteria</CardDescription>
              </CardHeader>
              <CardContent>
                {criteriaAverages.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={criteriaAverages}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="averageScore"
                        nameKey="criteria"
                        label={({criteria, averageScore}) => `${criteria}: ${averageScore.toFixed(1)}`}
                      >
                        {criteriaAverages.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div>No data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Raw Data</h3>
            {analyticsData?.rawData && analyticsData.rawData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr>
                      <th className="border p-2">Ticket ID</th>
                      <th className="border p-2">Average Score</th>
                      {/* Add more headers as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.rawData.map((item) => (
                      <tr key={item.id}>
                        <td className="border p-2">{item.ticketId}</td>
                        <td className="border p-2">{item.averageScore}</td>
                        {/* Add more data cells as needed */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No raw data available</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
