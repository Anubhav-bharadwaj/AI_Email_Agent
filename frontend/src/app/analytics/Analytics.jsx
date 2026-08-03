import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';

const engagementData = [
{ name: 'Mon', deliveryRate: 99, openRate: 45, clickRate: 12 },
{ name: 'Tue', deliveryRate: 98, openRate: 52, clickRate: 15 },
{ name: 'Wed', deliveryRate: 99, openRate: 48, clickRate: 14 },
{ name: 'Thu', deliveryRate: 97, openRate: 61, clickRate: 18 },
{ name: 'Fri', deliveryRate: 99, openRate: 55, clickRate: 16 },
{ name: 'Sat', deliveryRate: 100, openRate: 42, clickRate: 10 },
{ name: 'Sun', deliveryRate: 99, openRate: 49, clickRate: 13 }];

const volumeData = [
{ name: 'Mon', sent: 4000, failed: 240, skipped: 100 },
{ name: 'Tue', sent: 3000, failed: 139, skipped: 50 },
{ name: 'Wed', sent: 2000, failed: 980, skipped: 120 },
{ name: 'Thu', sent: 2780, failed: 390, skipped: 80 },
{ name: 'Fri', sent: 1890, failed: 480, skipped: 40 },
{ name: 'Sat', sent: 2390, failed: 380, skipped: 20 },
{ name: 'Sun', sent: 3490, failed: 430, skipped: 60 }];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function Analytics() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your campaign performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>Delivery, Open, and Click rates over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }} />
                    
                    <Area type="monotone" dataKey="deliveryRate" name="Delivery Rate" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorDelivery)" />
                    <Area type="monotone" dataKey="openRate" name="Open Rate" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorOpen)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
            <CardHeader>
              <CardTitle>Email Volume</CardTitle>
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
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', color: '#F9FAFB' }}
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    
                    <Bar dataKey="sent" name="Sent" fill="#7C3AED" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="skipped" name="Skipped" fill="#6B7280" radius={[0, 0, 0, 0]} stackId="a" />
                    <Bar dataKey="failed" name="Failed" fill="#EF4444" radius={[0, 0, 4, 4]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>);

}