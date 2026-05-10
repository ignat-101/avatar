import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, RefreshCw, Sparkles, LayoutTemplate, Type, Image as ImageIcon } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { cn } from './utils/cn';
import { BACKGROUNDS } from './constants';
import { TonLogo } from './components/Icons';

export default function App() {
  const [domain, setDomain] = useState(WebApp.initDataUnsafe?.user?.username || 'username');
  const [bgIndex, setBgIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [glassMode, setGlassMode] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const avatarRef = useRef<HTMLDivElement>(null);

  const currentBg = BACKGROUNDS[bgIndex];

  const handleRandomize = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * BACKGROUNDS.length);
    } while (nextIndex === bgIndex);
    setBgIndex(nextIndex);
  };

  const handleDownload = useCallback(async () => {
    if (avatarRef.current === null) return;
    try {
      setIsGenerating(true);
      // We scale it up by 3 for high-res output (1200x1200px based on 400x400px view)
      const dataUrl = await toPng(avatarRef.current, { 
        quality: 1, 
        pixelRatio: 4,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `${domain || 'avatar'}.ton.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate avatar', err);
    } finally {
      setIsGenerating(false);
    }
  }, [domain]);

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white selection:bg-[#0098ea]/30 flex flex-col font-inter">
      {/* App Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0f0f13]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0098ea] flex items-center justify-center shadow-[0_0_15px_rgba(0,152,234,0.4)]">
            <TonLogo className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-outfit font-bold text-xl tracking-tight">TON Avatar Bot</h1>
        </div>
        <button 
          onClick={handleRandomize}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          title="Randomize Background"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col gap-8">
        
        {/* Avatar Preview Area */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group rounded-3xl p-1 bg-gradient-to-b from-white/10 to-transparent">
            {/* The actual element that will be converted to image */}
            <div 
              ref={avatarRef}
              className={cn(
                "w-72 h-72 sm:w-80 sm:h-80 rounded-[2rem] overflow-hidden relative flex flex-col items-center justify-center transition-all duration-500",
                currentBg.class
              )}
            >
              {/* Optional: Add some abstract background shapes based on Web3 theme */}
              <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#0098ea]/40 blur-3xl rounded-full"></div>

              {/* Central Content */}
              <div className={cn(
                "relative z-10 flex flex-col items-center justify-center p-8 w-11/12",
                glassMode ? cn("rounded-2xl backdrop-blur-md border", currentBg.glass) : "bg-transparent"
              )}>
                {showLogo && (
                  <TonLogo className={cn("w-12 h-12 mb-4 drop-shadow-lg", currentBg.text)} />
                )}
                
                <h2 className={cn(
                  "font-outfit font-extrabold text-3xl sm:text-4xl tracking-tight text-center break-all flex flex-col",
                  currentBg.text
                )}>
                  {domain || 'name'}
                  <span className="opacity-60 text-xl sm:text-2xl mt-1">.ton</span>
                </h2>
              </div>
            </div>

            {/* Absolute badge for "Preview" */}
            <div className="absolute -top-3 -right-3 bg-[#0098ea] text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-[#0098ea]/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Preview
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 bg-[#1a1a20] p-6 rounded-3xl border border-white/5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Type className="w-4 h-4" /> Domain Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value.replace(/\.ton$/i, ''))}
                placeholder="username"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0098ea] transition-all"
                maxLength={24}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                .ton
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Theme Style
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BACKGROUNDS.map((bg, idx) => (
                <button
                  key={bg.id}
                  onClick={() => setBgIndex(idx)}
                  className={cn(
                    "w-full aspect-square rounded-xl transition-all border-2",
                    bgIndex === idx ? "border-[#0098ea] scale-105 shadow-lg" : "border-transparent hover:scale-105",
                    bg.class
                  )}
                  title={bg.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex-1 flex items-center justify-center gap-2 bg-black/30 border border-white/5 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors text-sm font-medium">
              <input 
                type="checkbox" 
                checked={glassMode} 
                onChange={(e) => setGlassMode(e.target.checked)}
                className="hidden" 
              />
              <LayoutTemplate className={cn("w-4 h-4", glassMode ? "text-[#0098ea]" : "text-gray-500")} />
              Glassmorphism
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 bg-black/30 border border-white/5 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors text-sm font-medium">
              <input 
                type="checkbox" 
                checked={showLogo} 
                onChange={(e) => setShowLogo(e.target.checked)}
                className="hidden" 
              />
              <TonLogo className={cn("w-4 h-4", showLogo ? "text-[#0098ea]" : "text-gray-500")} />
              TON Logo
            </label>
          </div>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full bg-[#0098ea] hover:bg-[#0086cf] text-white font-outfit font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-[0_4px_20px_rgba(0,152,234,0.3)] mt-2"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isGenerating ? 'Generating...' : 'Download Avatar'}
          </button>
        </div>
      </main>
    </div>
  );
}
