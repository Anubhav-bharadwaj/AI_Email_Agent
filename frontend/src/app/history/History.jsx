import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Calendar, FileText, Download } from 'lucide-react';
import { getHistory, clearHistory } from '@/services/api';

import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { EmptyState } from '@/components/ui/empty-state';

export function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getHistory()
      .then((res) => {
        setLogs(res.logs);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load campaign history');
        setLoading(false);
      });
  }, []);

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      setLoading(true);
      try {
        await clearHistory();
        setLogs([]);
        toast.success('History cleared successfully');
      } catch {
        toast.error('Failed to clear history');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredLogs = logs.filter(
    (log) => {
      const matchesSearch = log.email.toLowerCase().includes(search.toLowerCase()) || log.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || log.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    }
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign History</h1>
          <p className="text-muted-foreground mt-1">Review past email logs, statuses, and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="destructive" onClick={handleClear} disabled={loading || logs.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </Button>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="py-4 border-b border-border/50">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
            <div className="relative w-full max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9 bg-background/50 focus-visible:bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
              
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
                {['all', 'sent', 'failed', 'skipped'].map((status) =>
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  statusFilter === status ?
                  'bg-background text-foreground shadow-sm' :
                  'text-muted-foreground hover:text-foreground'}`
                  }>
                  
                    {status}
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold h-12 px-6">Recipient</TableHead>
                  <TableHead className="font-semibold h-12">Interest Context</TableHead>
                  <TableHead className="font-semibold h-12 text-center">Status</TableHead>
                  <TableHead className="font-semibold h-12 text-right px-6">Sent Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ?
                Array.from({ length: 5 }).map((_, i) =>
                <TableRow key={i}>
                      <TableCell className="px-6 py-4"><div className="h-10 w-48 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-6 w-24 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell align="center"><div className="h-6 w-16 bg-muted rounded animate-pulse mx-auto" /></TableCell>
                      <TableCell align="right" className="px-6"><div className="h-6 w-24 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                    </TableRow>
                ) :
                filteredLogs.length === 0 ?
                <TableRow>
                    <TableCell colSpan={4} className="h-[400px]">
                      <EmptyState
                      icon={FileText}
                      title="No logs found"
                      description={search || statusFilter !== 'all' ? "No records match your filters. Try adjusting your search criteria." : "You haven't dispatched any campaigns yet."} />
                    
                    </TableCell>
                  </TableRow> :

                filteredLogs.map((log) =>
                <TableRow key={log.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-foreground">{log.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{log.email}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                          {log.interest}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={log.status.toLowerCase()} className="capitalize">{log.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right px-6 text-muted-foreground text-sm">
                        <div className="flex items-center justify-end gap-2 group-hover:text-foreground transition-colors">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </TableCell>
                    </TableRow>
                )
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>);

}