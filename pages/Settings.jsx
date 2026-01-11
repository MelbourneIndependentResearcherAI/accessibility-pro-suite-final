import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, ArrowLeft, Moon, Type, Volume2, Bell, ShieldCheck, Database, ChevronRight, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { base44 } from '@/api/base44Client';
import { OfflineStorage } from '@/components/pwa/OfflineStorage';
import { usePWA } from '@/components/pwa/PWAProvider';
import { toast } from 'sonner';

export default function Settings() {
  const { isOnline } = usePWA();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    darkMode: false,
    highContrast: false,
    largeText: false,
    voiceNavigation: false,
    notifications: true,
    fontSize: 16,
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    language: 'en',
    dyslexiaFont: 'default',
    colorBlindMode: 'none'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Load from local storage first
    const cached = OfflineStorage.getSettings();
    if (cached) {
      setSettings({ ...settings, ...cached });
    }

    // Sync with server if online
    if (isOnline) {
      try {
        const user = await base44.auth.me();
        if (user.settings) {
          setSettings({ ...settings, ...user.settings });
          OfflineStorage.saveSettings(user.settings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Save locally immediately
    OfflineStorage.saveSettings(settings);
    
    // Apply settings
    applySettings(settings);

    // Sync with server if online
    if (isOnline) {
      try {
        await base44.auth.updateMe({ settings });
        toast.success('Settings saved successfully');
      } catch (error) {
        console.error('Error saving settings:', error);
        toast.error('Settings saved locally only');
      }
    } else {
      toast.success('Settings saved locally');
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const applySettings = (newSettings) => {
    // Apply dark mode
    if (newSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply font size
    document.documentElement.style.fontSize = `${newSettings.fontSize}px`;

    // Apply dyslexia font
    const fontMap = {
      'default': 'system-ui, -apple-system, sans-serif',
      'opendyslexic': '"OpenDyslexic", sans-serif',
      'comic-sans': '"Comic Sans MS", "Comic Sans", cursive',
      'arial': 'Arial, sans-serif',
      'verdana': 'Verdana, sans-serif'
    };
    document.documentElement.style.fontFamily = fontMap[newSettings.dyslexiaFont] || fontMap.default;

    // Apply color blind mode
    const root = document.documentElement;
    root.className = root.className.replace(/cb-\w+/g, '');
    if (newSettings.colorBlindMode !== 'none') {
      root.classList.add(`cb-${newSettings.colorBlindMode}`);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Hub
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Settings</h1>
            </div>
            <Button 
              onClick={handleSave}
              disabled={saving || saved}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
                Appearance
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <Label htmlFor="dark-mode" className="text-sm sm:text-base font-medium">Dark Mode</Label>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Use dark theme across all apps</p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <Label htmlFor="high-contrast" className="text-sm sm:text-base font-medium">High Contrast</Label>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Increase contrast for better visibility</p>
                  </div>
                  <Switch 
                    id="high-contrast" 
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                  />
                </div>

                <div>
                  <Label className="text-sm sm:text-base font-medium mb-3 block">Color Blindness Mode</Label>
                  <Select value={settings.colorBlindMode} onValueChange={(value) => updateSetting('colorBlindMode', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Default)</SelectItem>
                      <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                      <SelectItem value="achromatopsia">Achromatopsia (Monochrome)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-2">Adjusts colors for better visibility</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Type className="w-5 h-5 sm:w-6 sm:h-6" />
                Text & Display
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <Label htmlFor="large-text" className="text-sm sm:text-base font-medium">Large Text</Label>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Increase text size</p>
                  </div>
                  <Switch 
                    id="large-text" 
                    checked={settings.largeText}
                    onCheckedChange={(checked) => updateSetting('largeText', checked)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm sm:text-base font-medium">Font Size</Label>
                    <span className="text-sm font-semibold text-purple-600">{settings.fontSize}px</span>
                  </div>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting('fontSize', value)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm sm:text-base font-medium mb-3 block">Dyslexia-Friendly Font</Label>
                  <Select value={settings.dyslexiaFont} onValueChange={(value) => updateSetting('dyslexiaFont', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (System Font)</SelectItem>
                      <SelectItem value="opendyslexic">OpenDyslexic</SelectItem>
                      <SelectItem value="comic-sans">Comic Sans MS</SelectItem>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-2">Fonts designed for easier reading</p>
                </div>

                <div>
                  <Label className="text-sm sm:text-base font-medium mb-3 block">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                Screen Reader & Audio
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <Label htmlFor="voice-nav" className="text-sm sm:text-base font-medium">Voice Navigation</Label>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Enable voice-guided navigation</p>
                  </div>
                  <Switch 
                    id="voice-nav" 
                    checked={settings.voiceNavigation}
                    onCheckedChange={(checked) => updateSetting('voiceNavigation', checked)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm sm:text-base font-medium">Screen Reader Speed</Label>
                    <span className="text-sm font-semibold text-purple-600">{settings.voiceSpeed.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[settings.voiceSpeed]}
                    onValueChange={([value]) => updateSetting('voiceSpeed', Math.round(value * 10) / 10)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0.5x Slow</span>
                    <span>2.0x Fast</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm sm:text-base font-medium">Voice Pitch</Label>
                    <span className="text-sm font-semibold text-purple-600">{settings.voicePitch.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[settings.voicePitch]}
                    onValueChange={([value]) => updateSetting('voicePitch', Math.round(value * 10) / 10)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0.5 Low</span>
                    <span>2.0 High</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <Label htmlFor="notifications" className="text-sm sm:text-base font-medium">Push Notifications</Label>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Receive app notifications</p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting('notifications', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 sm:w-6 sm:h-6" />
                Offline Data
              </h2>
              
              <Link to={createPageUrl('OfflineData')}>
                <Button variant="outline" className="w-full justify-between">
                  <span className="text-sm sm:text-base">Manage Offline Data</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                Privacy & Security
              </h2>
              
              <Button variant="outline" className="w-full text-sm sm:text-base">
                View Privacy Policy
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}