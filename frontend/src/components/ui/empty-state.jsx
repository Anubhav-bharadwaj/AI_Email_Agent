
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border/50 bg-background/30", className)}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 relative">
        
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />
        <Icon className="w-10 h-10 text-primary relative z-10" />
      </motion.div>
      <h3 className="text-xl font-bold mb-2 tracking-tight text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8 text-sm">{description}</p>
      {action &&
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {action}
        </motion.div>
      }
    </div>);

}