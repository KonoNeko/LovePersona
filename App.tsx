import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, Heart, RefreshCw, BookOpen, X, Info, Home, User2, ChevronRight, Quote, Zap, Shield, Compass, Dog, Flower2, Feather, Moon, Brain, Gamepad2, Scroll, Snowflake, ShieldAlert, Hammer, Sword, Briefcase, Sun, Wind, Cloud, Coffee, AlertTriangle, Lightbulb, Users, Search, Loader2 } from 'lucide-react';
import { QUESTIONS, PERSONALITIES, CATEGORIES } from './constants';
import { DimensionType, PersonalityProfile, CategoryKey, Question, Gender } from './types';
import { generateAvatar } from './services/geminiService';

// --- Icon Mapping Helper ---
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Dog, Flower2: Flower2, Feather, Moon, 
    Brain, Gamepad2, Scroll, Snowflake, 
    ShieldAlert, Hammer, Sword, Briefcase, 
    Sun, Wind, Cloud, Coffee, 
    Butterfly: Flower2 // Fallback/Alias
  };
  return icons[iconName] || Heart;
};

// --- Analysis Section Component ---
const AnalysisCard = ({ title, content, icon: Icon, colorClass, borderClass }: { title: string, content: string, icon: any, colorClass: string, borderClass: string }) => (
  <div className={`bg-white/60 backdrop-blur-md border ${borderClass} rounded-xl p-6 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md group`}>
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '100')} border ${borderClass} group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <h3 className={`text-lg font-bold ${colorClass} tracking-wide uppercase`}>{title}</h3>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{content}</p>
  </div>
);

// --- Constants ---
const QUESTIONS_PER_PAGE = 6;

// --- Components ---

// Navigation Bar
const Navbar = ({ activeTab, onTabChange }: { activeTab: 'home' | 'dex', onTabChange: (tab: 'home' | 'dex') => void }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onTabChange('home')}>
            <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-rose-400 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-xl text-slate-700 tracking-tight">LovePersona</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onTabChange('home')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border ${
                activeTab === 'home' 
                  ? 'bg-violet-50 text-violet-600 border-violet-200' 
                  : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Home className="w-4 h-4" />
              主页
            </button>
            <button
              onClick={() => onTabChange('dex')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border ${
                activeTab === 'dex' 
                  ? 'bg-rose-50 text-rose-600 border-rose-200' 
                  : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              人格图鉴
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- TypeBrowser ---

const TypeBrowser = ({
    imageCache,
    setImageCache
}: {
    imageCache: Record<string, string>;
    setImageCache: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('NT');
  const [selectedProfileCode, setSelectedProfileCode] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>('female');
  
  // Image Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  
  // Memoize to prevent re-renders on every parent update unless category changes
  const currentProfiles = useMemo(() => 
    Object.values(PERSONALITIES).filter(p => p.category === activeCategory), 
    [activeCategory]
  );
  
  useEffect(() => {
    if (currentProfiles.length > 0 && !currentProfiles.find(p => p.code === selectedProfileCode)) {
      setSelectedProfileCode(currentProfiles[0].code);
    }
  }, [activeCategory, currentProfiles, selectedProfileCode]);

  const activeProfile = PERSONALITIES[selectedProfileCode || ''] || currentProfiles[0];
  const catConfig = CATEGORIES[activeCategory];
  const ProfileIcon = getIconComponent(activeProfile.icon);

  // Auto-Generate Image Logic (Initial Load & Cache Check)
  useEffect(() => {
    if (!activeProfile) return;

    const cacheKey = `${activeProfile.code}_${gender}`;
    
    // 1. Check Cache First
    if (imageCache[cacheKey]) {
        setCurrentAvatarUrl(imageCache[cacheKey]);
        setIsLoading(false);
        return;
    }

    // 2. Set Loading
    setIsLoading(true);
    setCurrentAvatarUrl(null);

    // 3. Debounce Generation (wait 800ms after selection stops changing)
    const timer = setTimeout(async () => {
        try {
            const url = await generateAvatar(activeProfile, gender);
            // Update cache and current image
            setImageCache(prev => ({ ...prev, [cacheKey]: url }));
            setCurrentAvatarUrl(url);
        } catch (e) {
            console.error("Dex generation failed:", e);
        } finally {
            setIsLoading(false);
        }
    }, 800); 

    return () => clearTimeout(timer);
  }, [activeProfile?.code, gender, imageCache, setImageCache]);

  // Manual Regeneration Function
  const handleRegenerate = async () => {
    if (isLoading || !activeProfile) return;
    
    setIsLoading(true);
    try {
        // Force new generation regardless of cache
        const url = await generateAvatar(activeProfile, gender);
        const cacheKey = `${activeProfile.code}_${gender}`;
        
        // Update state and overwrite cache
        setCurrentAvatarUrl(url);
        setImageCache(prev => ({ ...prev, [cacheKey]: url }));
    } catch (e) {
        console.error("Regeneration failed:", e);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] w-full transition-all duration-700 ease-in-out ${catConfig.bg} text-slate-800 overflow-hidden flex flex-col`}>
       
       {/* Top Bar */}
       <div className={`w-full bg-white/50 backdrop-blur-md border-b ${catConfig.border} p-4 z-20`}>
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {(Object.keys(CATEGORIES) as CategoryKey[]).map((catKey) => {
                const isActive = activeCategory === catKey;
                const config = CATEGORIES[catKey];
                let Icon = Zap;
                if (catKey === 'NF') Icon = Heart;
                if (catKey === 'ST') Icon = Shield;
                if (catKey === 'SF') Icon = Compass;

                return (
                  <button
                    key={catKey}
                    onClick={() => setActiveCategory(catKey)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                      isActive 
                      ? `${config.bg} ${config.color} ${config.border} shadow-sm scale-105` 
                      : 'bg-white/50 text-slate-500 border-transparent hover:bg-white hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="whitespace-nowrap">{config.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Gender Toggle & Refresh Control */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    className={`p-2 rounded-full bg-white/70 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-white transition-all shadow-sm ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    title="重绘当前形象"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
                </button>

                <div className="flex bg-white/70 rounded-full p-1 border border-slate-200">
                    <button 
                        onClick={() => setGender('male')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${gender === 'male' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <User2 className="w-3 h-3" /> 男生
                    </button>
                    <button 
                        onClick={() => setGender('female')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${gender === 'female' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <User2 className="w-3 h-3" /> 女生
                    </button>
                </div>
            </div>
         </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row h-full overflow-hidden relative">
          
          {/* Left: Character List */}
          <div className="w-full md:w-1/3 lg:w-1/4 p-6 flex flex-col gap-4 overflow-y-auto md:border-r border-slate-200/50 bg-white/40 backdrop-blur-sm z-10 order-2 md:order-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
             <div className="mb-2">
                <h2 className={`text-2xl font-black tracking-tight ${catConfig.color} drop-shadow-sm`}>
                    {CATEGORIES[activeCategory].title}
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">{CATEGORIES[activeCategory].subtitle}</p>
             </div>
             
             <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x">
               {currentProfiles.map(profile => {
                 const isSelected = selectedProfileCode === profile.code;
                 const ItemIcon = getIconComponent(profile.icon);
                 
                 return (
                   <div 
                     key={profile.code}
                     onClick={() => setSelectedProfileCode(profile.code)}
                     className={`flex-shrink-0 w-64 md:w-full snap-start cursor-pointer group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                       isSelected 
                       ? `bg-white ${catConfig.border} shadow-md scale-[1.02]` 
                       : 'bg-white/40 border-transparent hover:bg-white/80 hover:border-slate-200'
                     }`}
                   >
                      <div className="p-4 flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm ${
                            isSelected ? `${catConfig.bg} ${catConfig.color}` : 'bg-slate-100 text-slate-400'
                         }`}>
                            <ItemIcon className="w-6 h-6" />
                         </div>
                         <div>
                            <h3 className={`font-bold text-lg ${isSelected ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>
                              {profile.nickname}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 tracking-wider">{profile.code}</span>
                                <span className="text-xs text-slate-500">{profile.name}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                 );
               })}
             </div>
          </div>

          {/* Right: Hero Area */}
          <div className="flex-1 relative flex flex-col md:flex-row h-[60vh] md:h-auto order-1 md:order-2">
             
             {/* Character Image Display */}
             <div className="relative w-full md:w-1/2 h-full flex items-center justify-center bg-white overflow-hidden">
                
                {/* Background Tint */}
                <div className={`absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-20 bg-gradient-to-b ${catConfig.themeColor}`}></div>

                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                        <Loader2 className={`w-12 h-12 animate-spin ${catConfig.color} mb-4`} />
                        <p className={`font-bold ${catConfig.color} animate-pulse`}>正在绘制...</p>
                        <p className="text-xs text-slate-400 mt-2">AI 正在为您生成{gender === 'male' ? '男生' : '女生'}形象</p>
                    </div>
                )}
                
                {/* Generated Image */}
                {currentAvatarUrl && !isLoading ? (
                   <img 
                    src={currentAvatarUrl} 
                    alt={activeProfile.nickname} 
                    className={`h-full w-full object-cover object-center md:scale-105 transition-all duration-700 animate-in fade-in zoom-in-95`}
                    style={{ filter: "brightness(105%) saturate(95%) contrast(95%)" }} 
                   />
                ) : (
                    !isLoading && (
                        <div className={`text-center p-8 ${catConfig.color}`}>
                           <ProfileIcon className="w-32 h-32 mx-auto mb-4 opacity-50" />
                           <p className="font-bold text-lg opacity-60">请稍候...</p>
                        </div>
                    )
                )}

                {/* Floating Icon with Type Color */}
                <div className={`absolute top-6 right-6 z-20 p-3 bg-white/80 backdrop-blur-md rounded-2xl border-2 ${catConfig.border} shadow-lg`}>
                    <ProfileIcon className={`w-8 h-8 ${catConfig.color}`} />
                </div>

                {/* Mobile Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 md:hidden bg-gradient-to-t from-white/90 to-transparent">
                    <h1 className="text-4xl font-black text-slate-800">{activeProfile.nickname}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-slate-800 text-white text-xs font-bold rounded uppercase">{activeProfile.code}</span>
                    </div>
                    {/* Tags */}
                     <div className="flex flex-wrap gap-2 mt-3">
                        {activeProfile.tags && activeProfile.tags.map(tag => (
                            <span key={tag} className={`px-2 py-0.5 rounded text-[10px] font-bold bg-white/80 text-slate-600 shadow-sm`}>
                                #{tag}
                            </span>
                        ))}
                     </div>
                </div>
             </div>

             {/* Description Panel */}
             <div className="w-full md:w-1/2 h-full overflow-y-auto p-6 md:p-12 bg-white/40 backdrop-blur-xl md:border-l border-white/40 relative scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                 <div className="hidden md:block mb-8">
                     <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 bg-white border ${catConfig.border} ${catConfig