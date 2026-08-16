import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UploadCloud, CheckCircle2, Copy, Search, Mail, Monitor, Smartphone, Type, FileCode2, Sparkles, Send, FileSpreadsheet, ShieldAlert, BookOpen, PenTool } from 'lucide-react';
import { toast } from 'sonner';
import { useCampaignStore } from '@/store/campaignStore';
import { uploadCsv, startGenerate, getGenerateStatus, startSend, getSendStatus } from '@/services/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { scoreEmail } from '@/services/scorer';
import { Progress } from '@/components/ui/progress';

const steps = [
{ id: 1, name: 'Upload', icon: UploadCloud },
{ id: 2, name: 'Generate', icon: Sparkles },
{ id: 3, name: 'Preview', icon: Mail },
{ id: 4, name: 'Dispatch', icon: Send }];

export function CampaignBuilder() {
  const { step, setStep, customers, setCustomers, drafts, setDrafts, isGenerating, setIsGenerating, isSending, setIsSending, summary, setSummary, resetCampaign } = useCampaignStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDryRun, setIsDryRun] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [viewType, setViewType] = useState('text');
  const [dragActive, setDragActive] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [emailTone, setEmailTone] = useState('Professional');

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setDragActive(false);

    let file;
    if ('dataTransfer' in e) {
      file = e.dataTransfer.files?.[0];
    } else {
      file = e.target.files?.[0];
    }

    if (!file) return;
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }

    toast.info('Analyzing CSV data...');
    try {
      const res = await uploadCsv(file);
      setCustomers(res.customers);
      toast.success('CSV parsed successfully');
      setStep(2);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to parse CSV';
      toast.error(message);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { jobId } = await startGenerate(customers, emailTone);

      let job;
      do {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        job = await getGenerateStatus(jobId);
      } while (job.status === 'running');

      if (job.errors?.length > 0) {
        job.errors.forEach((err) =>
          toast.error(`Failed to generate for ${err.name}: ${err.error}`)
        );
      }

      setDrafts(job.drafts);
      if (job.drafts.length > 0) setSelectedDraftId(job.drafts[0].id);
      toast.success('AI Drafts generated');
      setStep(3);
    } catch (error) {
      toast.error('Failed to generate drafts');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    toast.info('Dispatching campaign...');
    const startTime = Date.now();
    try {
      const { jobId } = await startSend(customers, drafts, isDryRun);

      let job;
      do {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        job = await getSendStatus(jobId);
      } while (job.status === 'running');

      const seconds = Math.round((Date.now() - startTime) / 1000);
      setSummary({
        totalCustomers: customers.length,
        generated: drafts.length,
        sent: job.sent,
        failed: job.failed,
        skipped: job.skipped,
        duration: `${Math.floor(seconds / 60)}m ${seconds % 60}s`
      });
      setStep(4);
    } catch (error) {
      toast.error('Failed to send campaign');
    } finally {
      setIsSending(false);
    }
  };

  const handleDraftChange = (e) => {
    if (!selectedDraftId) return;
    const newDrafts = drafts.map(d => {
      if (d.id === selectedDraftId) {
        return { ...d, bodyPlain: e.target.value };
      }
      return d;
    });
    setDrafts(newDrafts);
  };

  const filteredDrafts = drafts.filter((d) => {
    const c = customers.find((cust) => cust.id === d.customerId);
    return c?.name.toLowerCase().includes(searchTerm.toLowerCase()) || c?.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedDraft = drafts.find((d) => d.id === selectedDraftId);
  const selectedCustomer = customers.find((c) => c.id === selectedDraft?.customerId);
  const scores = selectedDraft ? scoreEmail(selectedDraft.bodyPlain) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Builder</h1>
          <p className="text-muted-foreground mt-1">Create, preview, and dispatch personalized AI emails.</p>
        </div>
        
        {/* Animated Step Wizard */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {steps.map((s, i) =>
          <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm",
                  step === s.id ? "bg-accent text-white shadow-glow-sm" :
                  step > s.id ? "bg-success/20 text-success border border-success/30" :
                  "bg-muted border border-border text-muted-foreground"
                )}
                animate={step === s.id ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}>
                
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                </motion.div>
                <span className={cn("text-[10px] font-semibold uppercase tracking-wider mt-2", step >= s.id ? "text-foreground" : "text-muted-foreground")}>
                  {s.name}
                </span>
              </div>
              {i < steps.length - 1 &&
            <div className={cn("w-8 md:w-16 h-1 mx-2 md:mx-4 rounded-full transition-colors", step > s.id ? "bg-success" : "bg-muted")} />
            }
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 &&
        <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="border-dashed border-2 border-border/60 bg-background/30 backdrop-blur-sm overflow-hidden transition-colors">
              <CardContent
              className={cn(
                "flex flex-col items-center justify-center py-32 text-center transition-all duration-300 relative",
                dragActive ? "bg-accent/5 border-accent" : ""
              )}
              onDragOver={(e) => {e.preventDefault();setDragActive(true);}}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileUpload}>
              
                {dragActive && <div className="absolute inset-0 border-2 border-accent bg-accent/5 z-0 pointer-events-none" />}
                <div className="z-10 flex flex-col items-center">
                  <motion.div
                  animate={dragActive ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
                  className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-accent/20">
                  
                    <FileSpreadsheet className="w-10 h-10 text-accent" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Upload Recipients List</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Drag and drop your CSV file here or click to browse. We'll automatically detect Name, Email, and Context columns.
                  </p>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => {
                    setCustomers([{ id: '1', name: 'Demo User', email: 'demo@example.com', interest: 'AI Automation' }]);
                    setStep(2);
                  }}>Use Sample Data</Button>
                    <Button variant="premium" onClick={() => fileInputRef.current?.click()}>
                      Browse Files
                    </Button>
                    <Input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        }

        {step === 2 &&
        <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                <div>
                  <CardTitle>Data Verification</CardTitle>
                  <CardDescription>Found {customers.length} valid recipients ready for AI processing.</CardDescription>
                </div>
                <div className="space-x-3">
                  <Button variant="outline" onClick={() => setStep(1)}>Cancel</Button>
                  <Button variant="premium" onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate AI Drafts'}
                    {!isGenerating && <Sparkles className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isGenerating ?
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
                      <div className="absolute inset-2 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center shadow-glow-md">
                        <Sparkles className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-hover">
                        AI is writing personalized emails...
                      </h3>
                      <p className="text-muted-foreground mt-2">Analyzing context and crafting unique messages</p>
                    </div>
                    <div className="w-full max-w-md bg-muted rounded-full h-2 overflow-hidden mt-4">
                      <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent-hover"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }} />
                  
                    </div>
                  </div> :

              <div className="space-y-4">
                <div className="flex flex-col space-y-3 bg-accent/5 p-4 rounded-xl border border-accent/20">
                  <label className="text-sm font-semibold text-foreground">Select Global Email Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {['Professional', 'Casual', 'Persuasive', 'Enthusiastic'].map(tone => (
                      <Button 
                        key={tone} 
                        variant={emailTone === tone ? 'default' : 'outline'} 
                        onClick={() => setEmailTone(tone)}
                        className="rounded-full"
                      >
                        {tone}
                      </Button>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">This tone will be applied to all AI-generated drafts in this batch.</span>
                </div>
                <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Context / Interest</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.map((c) =>
                    <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">{c.name}</TableCell>
                            <TableCell className="text-muted-foreground">{c.email}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {c.interest}
                              </span>
                            </TableCell>
                          </TableRow>
                    )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              }
              </CardContent>
            </Card>
          </motion.div>
        }

        {step === 3 &&
        <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Drafts List */}
            <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm border-border/50 flex flex-col h-[700px]">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-lg">Recipients ({drafts.length})</CardTitle>
                <div className="relative w-full mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 bg-background" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="divide-y divide-border/50">
                  {filteredDrafts.map((draft) => {
                  const customer = customers.find((c) => c.id === draft.customerId);
                  const isSelected = selectedDraftId === draft.id;
                  return (
                    <div
                      key={draft.id}
                      onClick={() => setSelectedDraftId(draft.id)}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:bg-muted/50 border-l-2",
                        isSelected ? "bg-accent/5 border-l-accent" : "border-l-transparent"
                      )}>
                      
                        <div className="font-semibold text-sm">{customer?.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">{draft.subject}</div>
                      </div>);

                })}
                </div>
              </CardContent>
            </Card>

            {/* Right Column: Gmail-like Preview & Controls */}
            <div className="lg:col-span-2 space-y-4">
              {/* Scoring Panel */}
              {scores && (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">AI Quality Score</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{scores.overall}</span>
                      <span className="text-muted-foreground text-sm">/ 100</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><PenTool className="w-3 h-3" /> Professionalism</span>
                        <span className="font-medium">{scores.professionalism}%</span>
                      </div>
                      <Progress value={scores.professionalism} className="h-1.5" indicatorColor="bg-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><BookOpen className="w-3 h-3" /> Clarity</span>
                        <span className="font-medium">{scores.clarity}%</span>
                      </div>
                      <Progress value={scores.clarity} className="h-1.5" indicatorColor="bg-green-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><Type className="w-3 h-3" /> Grammar</span>
                        <span className="font-medium">{scores.grammar}%</span>
                      </div>
                      <Progress value={scores.grammar} className="h-1.5" indicatorColor="bg-purple-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Spam Risk</span>
                        <span className="font-medium">{100 - scores.spamRisk}%</span>
                      </div>
                      <Progress value={scores.spamRisk} className="h-1.5" indicatorColor={scores.spamRisk > 70 ? "bg-green-500" : scores.spamRisk > 40 ? "bg-yellow-500" : "bg-red-500"} />
                    </div>
                  </div>
                </Card>
              )}

              {/* Controls */}
              <Card className="bg-card/50 backdrop-blur-sm p-2 flex flex-col sm:flex-row justify-between items-center border-border/50">
                <div className="flex bg-muted p-1 rounded-lg">
                  <Button variant={previewMode === 'desktop' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewMode('desktop')} className="rounded-md h-7">
                    <Monitor className="w-4 h-4 mr-2" /> Desktop
                  </Button>
                  <Button variant={previewMode === 'mobile' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewMode('mobile')} className="rounded-md h-7">
                    <Smartphone className="w-4 h-4 mr-2" /> Mobile
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => setViewType((v) => v === 'html' ? 'text' : 'html')}>
                    {viewType === 'html' ? <Type className="w-4 h-4 mr-2" /> : <FileCode2 className="w-4 h-4 mr-2" />}
                    Edit {viewType === 'html' ? 'Raw Text' : 'HTML'}
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9" title="Copy to clipboard"><Copy className="h-4 w-4" /></Button>
                </div>
              </Card>

              {/* Email Preview */}
              <div className="bg-background rounded-xl border border-border/50 shadow-xl overflow-hidden flex flex-col h-[400px]">
                {/* Browser/Window Header */}
                <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-warning/80" />
                    <div className="w-3 h-3 rounded-full bg-success/80" />
                  </div>
                  <div className="mx-auto bg-background px-3 py-1 rounded-md text-xs font-mono text-muted-foreground w-1/2 text-center truncate">
                    Preview: {selectedCustomer?.email}
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-white dark:bg-[#121212] flex justify-center p-4 sm:p-8">
                  <motion.div
                  layout
                  className={cn(
                    "bg-white dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 mx-auto rounded-lg overflow-hidden flex flex-col w-full text-gray-900 dark:text-gray-100",
                    previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-2xl'
                  )}>
                  
                    {/* Email Headers */}
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-4">
                          <input 
                            type="text" 
                            className="text-xl font-bold bg-transparent w-full border-none focus:outline-none focus:ring-1 focus:ring-accent/50 rounded px-1 -ml-1" 
                            value={selectedDraft?.subject || ''} 
                            onChange={(e) => {
                              const newDrafts = drafts.map(d => d.id === selectedDraftId ? { ...d, subject: e.target.value } : d);
                              setDrafts(newDrafts);
                            }}
                          />
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500">Ac</div>
                            <div className="text-sm">
                              <div className="font-semibold">Acme Corp <span className="font-normal text-gray-500">&lt;hello@acme.com&gt;</span></div>
                              <div className="text-gray-500 text-xs">to {selectedCustomer?.name}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">Just now</div>
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="p-6 font-sans flex-1 flex flex-col">
                      {viewType === 'html' ?
                      <div dangerouslySetInnerHTML={{ __html: selectedDraft?.bodyHtml || '' }} className="prose prose-sm dark:prose-invert max-w-none flex-1" /> :
                      <textarea 
                        className="w-full flex-1 resize-none bg-transparent font-mono text-sm text-gray-700 dark:text-gray-300 border-none focus:outline-none focus:ring-1 focus:ring-accent/50 p-2 rounded" 
                        value={selectedDraft?.bodyPlain || ''}
                        onChange={handleDraftChange}
                        placeholder="Type your email body here..."
                      />
                    }
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Dispatch Action Card */}
              <Card className="bg-gradient-to-r from-background to-muted/30 border-border/50">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dryrun" checked={isDryRun} onCheckedChange={(c) => setIsDryRun(c)} />
                      <Label htmlFor="dryrun" className="font-medium">Enable Dry Run (Simulate sending)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="confirm" checked={isConfirmed} onCheckedChange={(c) => setIsConfirmed(c)} />
                      <Label htmlFor="confirm" className="font-medium text-destructive">I confirm these {drafts.length} emails are ready.</Label>
                    </div>
                  </div>
                  <Button variant="premium" onClick={handleSend} disabled={!isConfirmed || isSending} className={cn(!isDryRun && "bg-destructive hover:bg-destructive/90")} isLoading={isSending}>
                    {isSending ? 'Dispatching...' : isDryRun ? 'Start Dry Run' : 'Send Campaign Now'}
                    {!isSending && <Send className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        }

        {step === 4 && summary &&
        <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="max-w-2xl mx-auto border-success/30 bg-success/5 overflow-hidden backdrop-blur-sm relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-success to-emerald-400" />
              
              <CardContent className="pt-12 pb-8 px-8 flex flex-col items-center text-center">
                <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-success/10">
                
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </motion.div>
                
                <CardTitle className="text-3xl font-bold tracking-tight mb-2">Campaign Dispatched!</CardTitle>
                <CardDescription className="text-base">
                  Your automation has completed successfully. Here is the summary of the run.
                </CardDescription>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-10">
                  {[
                { label: 'Sent', value: summary.sent, color: 'text-success' },
                { label: 'Failed', value: summary.failed, color: 'text-destructive' },
                { label: 'Skipped', value: summary.skipped, color: 'text-muted-foreground' },
                { label: 'Time', value: summary.duration, color: 'text-foreground' }].
                map((stat, i) =>
                <div key={i} className="p-4 bg-background/50 rounded-xl border border-border/50 backdrop-blur shadow-sm">
                      <div className={cn("text-3xl font-bold mb-1", stat.color)}>{stat.value}</div>
                      <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{stat.label}</div>
                    </div>
                )}
                </div>

                <div className="mt-10 flex gap-4 w-full justify-center">
                  <Link to="/history" className={buttonVariants({ variant: 'outline' })}>
                    View Detailed Logs
                  </Link>
                  <Button variant="premium" onClick={resetCampaign}>
                    Create New Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        }
      </AnimatePresence>
    </div>);
}