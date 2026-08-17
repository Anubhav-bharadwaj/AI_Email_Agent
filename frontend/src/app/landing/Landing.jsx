import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Zap, Shield, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export function Landing() {
  const { user } = useAuthStore();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-accent/30">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24">
        {/* Navigation / Header */}
        <nav className="flex justify-between items-center mb-20 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">MailForge</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" className="rounded-full px-6 border-border/50 hover:bg-accent/10 hover:text-accent transition-colors">
                  Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="rounded-full px-6 border-border/50 hover:bg-accent/10 hover:text-accent transition-colors">
                  Sign In
                </Button>
              </Link>
            )}
          </motion.div>
        </nav>

        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Next-Generation AI Email Agent
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Unleash the Power of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-400 to-purple-500">
              AI Outreach
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            MailForge transforms your cold outreach into personalized, high-converting conversations using state-of-the-art AI. Draft, score, and send hundreds of unique emails in seconds.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="premium" size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-accent/20 group">
                Enter Workspace 
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="http://localhost:8501" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted group">
                <LayoutDashboard className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                Streamlit Admin
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
        >
          <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50 shadow-2xl shadow-black/5 hover:border-accent/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Hyper-Personalization</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload a CSV and let our LLM dynamically craft unique, context-aware emails for every single recipient based on their interests.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50 shadow-2xl shadow-black/5 hover:border-accent/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Quality Scoring</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every draft is automatically scored for professionalism, clarity, grammar, and spam risk before it ever hits an inbox.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50 shadow-2xl shadow-black/5 hover:border-accent/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Architecture</h3>
            <p className="text-muted-foreground leading-relaxed">
              Fully containerized deployment with encrypted API key management and zero local data footprint for maximum privacy.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
