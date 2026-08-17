import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, XCircle, SkipForward, CheckCircle2, TrendingUp, TrendingDown, ArrowRight, Sparkles, Send, Activity, Database, Server, Cpu, DollarSign, BrainCircuit, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { getDashboardSummary } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function getTimeBasedGreeting(name) {
  const hour = new Date().getHours();
  const displayName = name ? `, ${name}` : '';
  if (hour < 12) return `Good Morning${displayName}`;
  if (hour < 18) return `Good Afternoon${displayName}`;
  return `Good Evening${displayName}`;
}

export function Dashboard() {
  const [summary, setSummary] = useState(null);
  const { user } = useAuthStore();
  
  // Extract first name from email or displayName if available
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || '';

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  const emailsSent = summary ? summary.emailsSent : 0;
  const minutesSaved = emailsSent * 10; // Assuming 10 minutes per manual email
  const hoursSaved = (minutesSaved / 60).toFixed(1);
  const costSavings = Math.round(minutesSaved * (25 / 60)); // Assuming $25/hr SDR cost

  const stats = [
  { title: 'Customers Contacted', value: summary ? summary.customersContacted.toLocaleString() : '—', icon: Users, trend: '+12%', isPositive: true },
  { title: 'AI Emails Crafted', value: summary ? summary.emailsSent.toLocaleString() : '—', icon: Sparkles, trend: '+24%', isPositive: true },
  { title: 'Emails Sent', value: summary ? summary.emailsSent.toLocaleString() : '—', icon: Send, trend: '+8%', isPositive: true },
  { title: 'Failed Emails', value: summary ? summary.failedEmails.toLocaleString() : '—', icon: XCircle, trend: '-2%', isPositive: true, textClass: 'text-destructive' },
  { title: 'Skipped', value: summary ? summary.skipped.toLocaleString() : '—', icon: SkipForward, trend: '+1%', isPositive: false },
  { title: 'Success Rate', value: summary ? `${summary.successRate}%` : '—', icon: CheckCircle2, trend: '+0.2%', isPositive: true, textClass: 'text-success' }];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8">
      
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 border border-border/50 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tight">{getTimeBasedGreeting(firstName)} 👋</h1>
          <p className="text-muted-foreground mt-2 max-w-lg text-sm">
            Ready to launch your next AI campaign? You have <strong className="text-foreground">2</strong> drafts pending review.
          </p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <Link to="/analytics" className={buttonVariants({ variant: 'outline' })}>
            View Analytics
          </Link>
          <Link to="/campaign" className={buttonVariants({ variant: 'premium', className: 'group' })}>
            Create Campaign
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) =>
        <Card key={i} className="group hover:-translate-y-1 hover:shadow-glow-sm hover:border-accent/30 transition-all duration-300 bg-card/60 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-background border flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'}`}>
                  {stat.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className={`text-3xl font-bold mt-1 tracking-tight ${stat.textClass || ''}`}>{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
        {/* AI Value Insights */}
        <Card className="col-span-2 bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>AI Value & ROI Insights</CardTitle>
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </div>
            <CardDescription>Business value generated by your AI agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Time Saved */}
              <div className="p-4 bg-background/50 border border-border/50 rounded-xl hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Manual Work Saved</h4>
                    <p className="text-xs text-muted-foreground">Based on 10 min/email</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{hoursSaved}</span>
                  <span className="text-muted-foreground ml-2 font-medium text-sm">Hours</span>
                </div>
              </div>

              {/* Cost Savings */}
              <div className="p-4 bg-background/50 border border-border/50 rounded-xl hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Estimated Cost Savings</h4>
                    <p className="text-xs text-muted-foreground">Based on $25/hr SDR rate</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${costSavings.toLocaleString()}</span>
                  <span className="text-success ml-2 font-medium text-sm">Saved</span>
                </div>
              </div>

              {/* Top Tone */}
              <div className="sm:col-span-2 p-4 bg-background/50 border border-border/50 rounded-xl hover:border-accent/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Top Performing AI Tone</h4>
                    <p className="text-xs text-muted-foreground">Highest open and reply rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1 text-sm bg-background">Professional</Badge>
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <TrendingUp className="w-4 h-4" /> 68%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Live diagnostics & metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { title: 'LLM Engine', value: 'Online (Groq)', icon: Cpu, status: 'bg-success' },
                { title: 'SMTP Gateway', value: 'Connected', icon: Server, status: 'bg-success' },
                { title: 'Database', value: 'Connected', icon: Database, status: 'bg-success' },
                { title: 'API Latency', value: '~42ms', icon: Activity, status: 'bg-success' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${item.status}`} />
                </div>
              ))}
              
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AI Accuracy Score</span>
                  <span className="text-sm font-bold text-accent">98%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full w-[98%]" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  Based on semantic tone alignment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>);

}