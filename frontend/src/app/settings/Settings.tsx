import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { mockGetSettings, mockUpdateSettings } from '@/services/api';
import type { AppSettings } from '@/types';
import { motion } from 'framer-motion';
import { Image, Upload, Save, Shield, Settings2, AtSign, Cpu, Building2, Paintbrush } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mockGetSettings().then((res) => {
      setSettings(res);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await mockUpdateSettings(settings);
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') setLogoPreview(reader.result as string);
        if (type === 'banner') setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading || !settings) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your team preferences and technical integrations.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="premium">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="mb-6 p-1 bg-muted/50 border border-border/50">
          <TabsTrigger value="branding" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"><Paintbrush className="w-4 h-4 mr-2"/>Branding</TabsTrigger>
          <TabsTrigger value="general" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"><Settings2 className="w-4 h-4 mr-2"/>General</TabsTrigger>
          <TabsTrigger value="smtp" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"><AtSign className="w-4 h-4 mr-2"/>SMTP Config</TabsTrigger>
          <TabsTrigger value="ai" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"><Cpu className="w-4 h-4 mr-2"/>AI Engine</TabsTrigger>
        </TabsList>
        
        {/* BRANDING (Live Preview) */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-accent"/> Company Profile</CardTitle>
                  <CardDescription>Update your company details used in email templates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Sender Email Address</Label>
                    <Input id="companyEmail" type="email" value={settings.companyEmail} onChange={e => setSettings({...settings, companyEmail: e.target.value})} className="bg-background/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Image className="w-5 h-5 text-accent"/> Visual Assets</CardTitle>
                  <CardDescription>Upload logos and banners to customize your outgoing emails.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Company Logo (Square)</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border/80 flex items-center justify-center overflow-hidden bg-muted/30">
                        {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-muted-foreground/50" />}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}><Upload className="w-4 h-4 mr-2"/> Upload Logo</Button>
                      <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Email Banner (1200x400)</Label>
                    <div className="flex flex-col gap-3">
                      <div className="w-full h-32 rounded-xl border-2 border-dashed border-border/80 flex items-center justify-center overflow-hidden bg-muted/30">
                        {bannerPreview ? <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" /> : <Image className="w-8 h-8 text-muted-foreground/50" />}
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => bannerInputRef.current?.click()}><Upload className="w-4 h-4 mr-2"/> Upload Banner</Button>
                        <input type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Email Preview Panel */}
            <div>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full overflow-hidden flex flex-col">
                <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Live Email Preview
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-accent/20 text-accent">Desktop</span>
                  </CardTitle>
                </CardHeader>
                <div className="flex-1 bg-white dark:bg-[#121212] p-8 flex items-start justify-center">
                  <div className="w-full max-w-md bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300">
                    {/* Header/Banner Area */}
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-900 relative">
                      {bannerPreview ? (
                        <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-accent/20 to-accent-hover/20 flex items-center justify-center">
                          <span className="text-muted-foreground/50 text-xs uppercase tracking-widest font-semibold">Banner Placeholder</span>
                        </div>
                      )}
                      
                      {/* Logo Avatar Overlap */}
                      <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-xl border-4 border-white dark:border-[#1A1A1A] bg-white shadow-sm overflow-hidden flex items-center justify-center">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            {settings.companyName.substring(0, 1) || 'C'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 pt-10">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome to {settings.companyName || 'Your Company'}</h3>
                      <div className="space-y-2 mt-4">
                        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
                        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
                        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full w-4/6"></div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-500 text-center">
                          Sent by {settings.companyName || 'Company'} • {settings.companyEmail || 'hello@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* GENERAL */}
        <TabsContent value="general" className="space-y-4 max-w-2xl">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:border-accent/30 transition-colors">
                <div className="space-y-1 mr-4">
                  <Label className="text-base font-semibold">Safety Dry Run</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">Require explicit manual confirmation to send emails. When enabled, campaigns default to Dry Run mode to simulate delivery without actual dispatch.</p>
                </div>
                <Switch checked={settings.defaultDryRun} onCheckedChange={c => setSettings({...settings, defaultDryRun: c})} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP */}
        <TabsContent value="smtp" className="space-y-4 max-w-2xl">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-accent"/> SMTP Credentials</CardTitle>
              <CardDescription>Configure your secure email delivery server connection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Host</Label>
                  <Input id="smtpHost" value={settings.smtpHost} onChange={e => setSettings({...settings, smtpHost: e.target.value})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port</Label>
                  <Input id="smtpPort" type="number" value={settings.smtpPort} onChange={e => setSettings({...settings, smtpPort: parseInt(e.target.value)})} className="bg-background/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUser">Username</Label>
                <Input id="smtpUser" value={settings.smtpUser} onChange={e => setSettings({...settings, smtpUser: e.target.value})} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPass">Password</Label>
                <Input id="smtpPass" type="password" value={settings.smtpPass} onChange={e => setSettings({...settings, smtpPass: e.target.value})} className="bg-background/50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI ENGINE */}
        <TabsContent value="ai" className="space-y-4 max-w-2xl">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cpu className="w-5 h-5 text-accent"/> Engine Configuration</CardTitle>
              <CardDescription>Manage your Groq LLM API keys and limits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="groqKey">Groq API Key</Label>
                <Input id="groqKey" type="password" value={settings.groqApiKey} onChange={e => setSettings({...settings, groqApiKey: e.target.value})} className="bg-background/50 font-mono text-sm tracking-widest" placeholder="gsk_..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Generation Rate Limit (requests/min)</Label>
                <Input id="rateLimit" type="number" value={settings.rateLimit} onChange={e => setSettings({...settings, rateLimit: parseInt(e.target.value)})} className="bg-background/50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
