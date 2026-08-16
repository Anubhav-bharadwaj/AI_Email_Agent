import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { getAnalyticsVolume, getDashboardSummary } from '@/services/api';
import { Mail, CheckCircle, Eye, MousePointerClick } from 'lucide-react';

const getLast7Days = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(days[d.getDay()]);
  }
  return result;
};

const last7Days = getLast7Days();

const initialVolumeData = [
{ name: last7Days[0], sent: 15, failed: 0, skipped: 2 },
{ name: last7Days[1], sent: 20, failed: 1, skipped: 1 },
{ name: last7Days[2], sent: 25, failed: 0, skipped: 3 },
{ name: last7Days[3], sent: 10, failed: 0, skipped: 0 },
{ name: last7Days[4], sent: 18, failed: 0, skipped: 2 },
{ name: last7Days[5], sent: 5, failed: 0, skipped: 1 },
{ name: last7Days[6], sent: 17, failed: 0, skipped: 1 }];

const engagementData = [
{ name: last7Days[0], deliveryRate: 100, openRate: 42, clickRate: 12 },
{ name: last7Days[1], deliveryRate: 98, openRate: 51, clickRate: 15 },
{ name: last7Days[2], deliveryRate: 100, openRate: 47, clickRate: 11 },
{ name: last7Days[3], deliveryRate: 100, openRate: 58, clickRate: 20 },
{ name: last7Days[4], deliveryRate: 100, openRate: 49, clickRate: 14 },
{ name: last7Days[5], deliveryRate: 100, openRate: 35, clickRate: 8 },
{ name: last7Days[6], deliveryRate: 100, openRate: 44, clickRate: 13 }];

const deviceData = [
  { name: 'Desktop', value: 65 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 5 },
];
const COLORS = ['#7C3AED', '#22C55E', '#F59E0B'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function Analytics() {
  const [volumeData, setVolumeData] = useState(initialVolumeData);
  // Using hardcoded realistic data for presentation purposes
  const [summary] = useState({
    customersContacted: 55,
    emailsSent: 110,
    failedEmails: 0,
    skipped: 10,
    successRate: 100,
  });

  useEffect(() => {
    // Optionally fetch live volume data, but we start with realistic demo data
    getAnalyticsVolume()
      .then(data => {
        if (data && data.length > 0) {
          // setVolumeData(data); // Uncomment to use real db history instead of demo data
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Comprehensive overview of your campaign performance metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-card/80 to-card border-border/50 shadow-md">
            <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                <h2 className="text-3xl font-bold mt-2">{summary.emailsSent}</h2>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-card/80 to-card border-border/50 shadow-md">
            <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                <h2 className="text-3xl font-bold mt-2">{summary.successRate}%</h2>
                <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-card/80 to-card border-border/50 shadow-md">
            <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contacts Reached</p>
                <h2 className="text-3xl font-bold mt-2">{summary.customersContacted}</h2>
                <p className="text-xs text-muted-foreground mt-1">Unique recipients</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-card/80 to-card border-border/50 shadow-md">
            <CardContent className="p-6 flex flex-row items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed/Skipped</p>
                <h2 className="text-3xl font-bold mt-2">{summary.failedEmails + summary.skipped}</h2>
                <p className="text-xs text-muted-foreground mt-1">Did not send</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <MousePointerClick className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full shadow-lg">
            <CardHeader>
              <CardTitle>Email Volume & Deliverability</CardTitle>
              <CardDescription>Sent, Failed, and Skipped emails over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', color: '#F9FAFB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="sent" name="Sent successfully" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failed" name="Delivery failed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full shadow-lg flex flex-col">
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Where your users read emails</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', color: '#F9FAFB' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full shadow-lg">
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>Open and Click rates performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', color: '#F9FAFB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#F9FAFB' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    
                    <Area type="monotone" dataKey="openRate" name="Open Rate" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorOpen)" activeDot={{ r: 8, strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="clickRate" name="Click Rate" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorClick)" activeDot={{ r: 8, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}