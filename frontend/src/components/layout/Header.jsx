import { useState } from 'react';
import { Menu, Search, Bell, Moon, Sun, Command, ChevronDown, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    signOut();
  };

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 w-full transition-all">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-lg p-1 border border-border/50 hover:border-border transition-colors cursor-pointer">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            {user?.email?.charAt(0).toUpperCase() || 'M'}
          </div>
          <span className="text-sm font-medium px-1 max-w-[120px] truncate">{user?.email || 'MailForge'}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground mr-1" />
        </div>
      </div>
      
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search campaigns, emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-9 pr-12 bg-muted/30 border-border/50 focus-visible:bg-background transition-all rounded-full h-9" />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" onClick={() => setHasNotifications(false)}>
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
          )}
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none rounded-full focus-visible:ring-2 focus-visible:ring-ring"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-border/50 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full border border-border/50 bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4 text-muted-foreground" />}
              </div>
            )}
          </button>
          
          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border/50">
                    <p className="text-sm font-medium truncate">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <SettingsIcon className="w-4 h-4 mr-2" /> Settings
                    </Link>
                  </div>
                  <div className="py-1 border-t border-border/50">
                    <button onClick={handleSignOut} className="w-full flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="w-4 h-4 mr-2" /> Log out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}