import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, BarChart, Settings, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const navItems = [
{ name: 'Dashboard', path: '/', icon: LayoutDashboard },
{ name: 'New Campaign', path: '/campaign', icon: PlusCircle },
{ name: 'Analytics', path: '/analytics', icon: BarChart },
{ name: 'History', path: '/history', icon: History },
{ name: 'Settings', path: '/settings', icon: Settings },
{ name: 'Streamlit App', path: 'http://localhost:8501', icon: Sparkles, external: true }];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="border-r border-border/50 bg-sidebar flex flex-col relative z-20 transition-all duration-300 hidden md:flex">
      
      <div className="h-16 flex items-center px-4 border-b border-border/50 justify-between">
        <div className="flex items-center overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden bg-background border border-border/50">
            <img src="/logo.jpg" alt="MailForge Logo" className="w-full h-full object-cover" />
          </div>
          {!isCollapsed &&
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center ml-3">
              <span className="font-bold text-[15px] tracking-tight">MailForge</span>
              <span className="ml-2 inline-flex items-center rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent border border-accent/20">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </span>
            </motion.div>
          }
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-5 h-8 w-8 rounded-full border border-border bg-background shadow-sm z-50 hover:bg-accent hover:text-white"
        onClick={() => setIsCollapsed(!isCollapsed)}>
        
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col justify-between">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                    isCollapsed ? 'justify-center' : ''
                  )}>
                  <item.icon className={cn(
                    "w-[18px] h-[18px] z-10 transition-colors shrink-0",
                    "text-muted-foreground group-hover:text-foreground",
                    isCollapsed ? "mx-auto" : "mr-3"
                  )} />
                  {!isCollapsed &&
                    <span className="z-10 text-muted-foreground group-hover:text-foreground">
                      {item.name}
                    </span>
                  }
                </a>
              );
            }
            
            const isActive = location.pathname === item.path || item.path !== '/' && location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                  isCollapsed ? 'justify-center' : ''
                )}>
                
                {isActive &&
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/5 rounded-lg border border-accent/20 shadow-glow-sm"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }} />

                }
                
                <item.icon className={cn(
                  "w-[18px] h-[18px] z-10 transition-colors shrink-0",
                  isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
                  isCollapsed ? "mx-auto" : "mr-3"
                )} />
                
                {!isCollapsed &&
                <span className={cn("z-10", isActive ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground")}>
                    {item.name}
                  </span>
                }
              </Link>);

          })}
        </nav>

      </div>
    </motion.aside>);

}