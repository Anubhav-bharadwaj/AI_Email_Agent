import { Menu, Search, Bell, Moon, Command, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 w-full transition-all">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-lg p-1 border border-border/50 hover:border-border transition-colors cursor-pointer">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            Ac
          </div>
          <span className="text-sm font-medium px-1">Acme Corp</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground mr-1" />
        </div>
      </div>
      
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search campaigns, emails..."
            className="w-full pl-9 pr-12 bg-muted/30 border-border/50 focus-visible:bg-background transition-all rounded-full h-9" />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Moon className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border border-background shadow-glow-sm" />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none rounded-full focus-visible:ring-2 focus-visible:ring-ring">
          <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-8 h-8 rounded-full border border-border/50 object-cover" />
        </button>
      </div>
    </header>);

}