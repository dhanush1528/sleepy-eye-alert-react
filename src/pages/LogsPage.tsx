
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { LogsAPI } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Clock, Download, Filter, Calendar } from 'lucide-react';

interface LogEntry {
  id: string;
  status: 'awake' | 'drowsy' | 'sleeping';
  timestamp: string;
  duration?: number;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Mock data for the frontend demo
  const mockLogs: LogEntry[] = [
    {
      id: '1',
      status: 'awake',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      duration: 120,
    },
    {
      id: '2',
      status: 'drowsy',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      duration: 45,
    },
    {
      id: '3',
      status: 'sleeping',
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      duration: 30,
    },
    {
      id: '4',
      status: 'awake',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      duration: 180,
    },
    {
      id: '5',
      status: 'drowsy',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      duration: 60,
    },
  ];
  
  // Load logs on component mount
  useEffect(() => {
    // In a real app, this would fetch from the backend
    // For now, we'll use mock data
    setLoading(true);
    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 800);
    
    // Real implementation would be:
    /*
    const fetchLogs = async () => {
      try {
        const response = await LogsAPI.getLogs({});
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast({
          title: "Error",
          description: "Failed to load detection logs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
    */
  }, []);
  
  // Apply filters
  const applyFilters = () => {
    setLoading(true);
    
    // For the demo, we'll just filter the mock data client-side
    setTimeout(() => {
      let filteredLogs = [...mockLogs];
      
      if (startDate) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) >= new Date(startDate)
        );
      }
      
      if (endDate) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) <= new Date(endDate)
        );
      }
      
      if (statusFilter) {
        filteredLogs = filteredLogs.filter(log => 
          log.status === statusFilter
        );
      }
      
      setLogs(filteredLogs);
      setLoading(false);
    }, 500);
    
    // Real implementation would be:
    /*
    const fetchFilteredLogs = async () => {
      try {
        const response = await LogsAPI.getLogs({
          startDate,
          endDate,
          status: statusFilter,
        });
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast({
          title: "Error",
          description: "Failed to apply filters",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilteredLogs();
    */
  };
  
  // Download logs as CSV
  const downloadLogsCSV = () => {
    toast({
      title: "Downloading...",
      description: "Your logs are being prepared for download.",
    });
    
    // Mock download for demo
    setTimeout(() => {
      // Create CSV content
      const headers = ['Date/Time', 'Status', 'Duration (seconds)'];
      const csvRows = [
        headers,
        ...logs.map(log => [
          format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
          log.status,
          log.duration || 0,
        ]),
      ];
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `drowsiness-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Complete",
        description: "Your logs have been downloaded successfully.",
      });
    }, 1000);
    
    // Real implementation would be:
    /*
    LogsAPI.downloadLogs({
      startDate,
      endDate,
      status: statusFilter,
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `drowsiness-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Complete",
          description: "Your logs have been downloaded successfully.",
        });
      })
      .catch(error => {
        console.error('Error downloading logs:', error);
        toast({
          title: "Error",
          description: "Failed to download logs",
          variant: "destructive",
        });
      });
    */
  };
  
  // Format duration (seconds) to minutes and seconds
  const formatDuration = (seconds: number = 0) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 gradient-text animate-fade-in">Detection Logs</h1>
          <p className="text-gray-600 mb-6 animate-fade-in delay-100">Review your drowsiness detection history and export reports.</p>
          
          <Card className="mb-8 glass-card animate-fade-in delay-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2" size={20} />
                Filters
              </CardTitle>
              <CardDescription>
                Filter your detection logs by date range or status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-700 flex items-center">
                    <Calendar className="mr-1" size={14} />
                    Start Date
                  </label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-700 flex items-center">
                    <Calendar className="mr-1" size={14} />
                    End Date
                  </label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-xl" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-700">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="awake">Awake</SelectItem>
                      <SelectItem value="drowsy">Drowsy</SelectItem>
                      <SelectItem value="sleeping">Sleeping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={applyFilters} className="w-full rounded-xl button-hover-effect">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card animate-fade-in delay-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2" size={20} />
                  Detection History
                </CardTitle>
                <Button variant="outline" onClick={downloadLogsCSV} className="rounded-xl button-hover-effect">
                  <Download className="mr-2" size={16} />
                  Download CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock size={32} className="text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">No detection logs found.</p>
                  <p className="text-sm mt-1">Start a detection session to record data.</p>
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50/60">
                      <TableRow>
                        <TableHead className="font-medium">Date/Time</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log, index) => (
                        <TableRow 
                          key={log.id}
                          className={`transition-colors hover:bg-gray-50/80 ${index % 2 === 0 ? 'bg-white/60' : 'bg-gray-50/30'}`}
                        >
                          <TableCell>
                            {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={log.status} />
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatDuration(log.duration)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LogsPage;
