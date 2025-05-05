
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { TicketEvaluation } from '@/types';
import { format } from 'date-fns';

interface DataTabProps {
  data: TicketEvaluation[];
}

const DataTab: React.FC<DataTabProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter data based on search query
  const filteredData = data.filter(evaluation => 
    evaluation.ticketKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evaluation.evaluatorDisplayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

  // Calculate average score from criteria
  const getAverageScore = (criteria: Record<string, number>) => {
    if (!criteria || Object.keys(criteria).length === 0) return 'N/A';
    
    const scores = Object.values(criteria);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return avg.toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw Evaluation Data</CardTitle>
        <CardDescription>Detailed evaluation records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Input
            placeholder="Search by ticket ID or evaluator..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="max-w-sm"
          />
          <span className="ml-4 text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} records
          </span>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Evaluator</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">{evaluation.ticketKey}</TableCell>
                    <TableCell>{evaluation.evaluatorDisplayName}</TableCell>
                    <TableCell>{formatDate(evaluation.timestamp)}</TableCell>
                    <TableCell className="text-center">
                      {getAverageScore(evaluation.criteria)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {evaluation.feedback || '(No feedback provided)'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTab;
