import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Mail, XCircle, SkipForward, CheckCircle2, TrendingUp, TrendingDown, Clock, ArrowRight, Sparkles, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { getDashboardSummary } from '@/services/api';

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

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  const stats = [
  { title: 'Customers Contacted', value: summary ? summary.customersContacted.toLocaleString() : '—', icon: Users, trend: '+12%', isPositive: true },
  { title: 'Drafts Generated', value: '—', icon: Sparkles, trend: '+24%', isPositive: true },
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
          <h1 className="text-3xl font-bold tracking-tight">{getTimeBasedGreeting()} 👋</h1>
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
        {/* Recent Campaigns */}
        <Card className="col-span-2 bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Recent Campaigns</CardTitle>
                <Badge variant="outline" className="text-[10px] px-1.5 h-4">Demo Data</Badge>
              </div>
              <CardDescription>Your latest email automation runs</CardDescription>
            </div>
            <Link to="/history" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
              { name: 'Q3 SaaS Growth', status: 'success', sent: '1,200', date: '2 days ago', progress: 98 },
              { name: 'Churn Recovery', status: 'pending', sent: '450', date: '5 hours ago', progress: 45 },
              { name: 'Newsletter #42', status: 'success', sent: '8,400', date: '1 week ago', progress: 99 }].
              map((campaign, i) =>
              <div key={i} className="group flex items-center justify-between p-4 bg-background/50 border border-border/50 rounded-xl hover:border-accent/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{campaign.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{campaign.sent} recipients • {campaign.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={campaign.status} className="capitalize">{campaign.status}</Badge>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${campaign.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{campaign.progress}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Activity</CardTitle>
              <Badge variant="outline" className="text-[10px] px-1.5 h-4">Demo Data</Badge>
            </div>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border space-y-6">
              {[
              { title: 'Campaign Completed', time: '2 hours ago', icon: CheckCircle2, color: 'text-success' },
              { title: 'Emails Sent (1,200)', time: '3 hours ago', icon: Send, color: 'text-accent' },
              { title: 'Drafts Generated', time: '5 hours ago', icon: Sparkles, color: 'text-primary' },
              { title: 'CSV Uploaded', time: '5 hours ago', icon: Clock, color: 'text-muted-foreground' }].
              map((event, i) =>
              <div key={i} className="relative pl-8">
                  <span className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-background border flex items-center justify-center ring-4 ring-card ${event.color}`}>
                    <event.icon className="w-3 h-3" />
                  </span>
                  <p className="text-sm font-medium leading-none">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{event.time}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>);

}