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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilter>({
    startDate: null,
    endDate: null,
    category: 'all'
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
  const evaluationsByDayData = {
    labels: analyticsData?.overviewStats.evaluationsByDay.map(item => item.date),
    datasets: [
      {
        label: 'Evaluations',
        data: analyticsData?.overviewStats.evaluationsByDay.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const scoreDistributionData = {
    labels: analyticsData?.overviewStats.scoreDistribution.map(item => item.score),
    datasets: [
      {
        label: 'Score Distribution',
        data: analyticsData?.overviewStats.scoreDistribution.map(item => item.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const criteriaAverages = analyticsData?.criteriaStats ? Object.entries(analyticsData.criteriaStats).map(([criteria, data]) => ({
    criteria,
    averageScore: data.averageScore,
  })) : [];

  const criteriaPieChartData = {
    labels: criteriaAverages?.map(item => item.criteria),
    datasets: [
      {
        label: 'Average Score',
        data: criteriaAverages?.map(item => item.averageScore),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="space-x-2">
          <DatePicker
            mode="range"
            defaultMonth={filters.startDate}
            onSelect={(date) => handleFilterChange({ startDate: date?.from || null, endDate: date?.to || null })}
          />
          <Select onValueChange={(value) => handleFilterChange({ category: value })}>
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
          <Select onValueChange={setExportFormat}>
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
                {analyticsData?.overviewStats.evaluationsByDay && analyticsData.overviewStats.evaluationsByDay.length > 0 ? (
                  <Bar data={evaluationsByDayData} />
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
                {analyticsData?.overviewStats.scoreDistribution && analyticsData.overviewStats.scoreDistribution.length > 0 ? (
                  <Bar data={scoreDistributionData} />
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
                {criteriaAverages && criteriaAverages.length > 0 ? (
                  <Pie data={criteriaPieChartData} />
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
