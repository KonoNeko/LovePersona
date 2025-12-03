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
                        <span className={`px-3 py-1 bg-white border ${catConfig.border} ${catConfig.color} text-xs font-bold rounded-full uppercase tracking-wider shadow-sm`}>
                            {activeProfile.category} Series
                        </span>
                        <span className={`px-3 py-1 ${catConfig.bg} ${catConfig.color} text-xs font-bold rounded-full`}>
                            {activeProfile.code}
                        </span>
                     </div>
                     <h1 className="text-5xl font-black text-slate-800 mb-2 tracking-tight leading-tight">{activeProfile.nickname}</h1>
                     <p className={`text-xl font-bold ${catConfig.color} mb-4`}>{activeProfile.name}</p>
                     
                     {/* Tags Display */}
                     <div className="flex flex-wrap gap-2 mb-2">
                        {activeProfile.tags && activeProfile.tags.map(tag => (
                            <span key={tag} className={`px-3 py-1 rounded-lg text-xs font-bold bg-white border ${catConfig.border} ${catConfig.color} shadow-sm`}>
                                #{tag}
                            </span>
                        ))}
                     </div>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="relative mb-8">
                        <Quote className="absolute -top-4 -left-2 w-8 h-8 text-slate-300 fill-current" />
                        <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-600 italic pl-6 border-l-4 border-slate-300">
                           "{activeProfile.definition}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <AnalysisCard title="深度人格结构" content={activeProfile.structure} icon={Brain} colorClass={catConfig.color} borderClass={catConfig.border} />
                        <AnalysisCard title="恋爱行为模式" content={activeProfile.behavior} icon={Heart} colorClass={catConfig.color} borderClass={catConfig.border} />
                        <AnalysisCard title="优势特质" content={activeProfile.strengths} icon={Sparkles} colorClass={catConfig.color} borderClass={catConfig.border} />
                        <AnalysisCard title="恋爱盲点" content={activeProfile.blindSpots} icon={AlertTriangle} colorClass={catConfig.color} borderClass={catConfig.border} />
                        <AnalysisCard title="适合的伴侣" content={activeProfile.partners} icon={Users} colorClass={catConfig.color} borderClass={catConfig.border} />
                        <AnalysisCard title="相处建议" content={activeProfile.advice} icon={Lightbulb} colorClass={catConfig.color} borderClass={catConfig.border} />
                    </div>
                 </div>
             </div>

          </div>
       </div>
    </div>
  );
};


// 1. Welcome Screen
const WelcomeScreen = ({ 
  onStart, 
  gender, 
  setGender 
}: { 
  onStart: () => void, 
  gender: Gender | null, 
  setGender: (g: Gender) => void 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden p-6 text-center bg-slate-50">
      {/* Pastel Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-sky-100 to-rose-100 z-0"></div>
      
      {/* Floating Blobs (Macaron Colors) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-200/40 rounded-full blur-[80px] animate-pulse"></div>

      <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] shadow-xl max-w-md w-full border border-white/60 transform transition-all z-10 relative">
        <div className="w-24 h-24 bg-gradient-to-tr from-violet-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-200 border-4 border-white animate-pulse">
          <Heart className="text-white w-12 h-12 drop-shadow-sm" fill="currentColor" />
        </div>
        
        <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">LovePersona AI</h1>
        <p className="text-violet-500 font-bold mb-8 tracking-wide text-lg">AI 驱动的 MBTI 恋爱人格深度解析</p>
        
        <p className="text-slate-600 mb-8 leading-relaxed font-medium text-lg">
          融合 <span className="text-indigo-500 font-bold">MBTI</span>、深度心理学与依恋理论，<br/>
          全维度解码你的恋爱基因。
          <br className="mb-4"/>
          请选择你的性别，解锁 AI 为你定制的<span className="text-rose-500 font-bold px-1">专属形象</span>。
        </p>

        {/* Gender Selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <button 
             onClick={() => setGender('male')}
             className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all group ${gender === 'male' ? 'border-violet-400 bg-violet-50 text-violet-700 shadow-md scale-105' : 'border-slate-100 bg-white/50 text-slate-400 hover:bg-white hover:border-slate-200'}`}
           >
             <User2 className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-lg">我是男生</span>
           </button>
           <button 
             onClick={() => setGender('female')}
             className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all group ${gender === 'female' ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-md scale-105' : 'border-slate-100 bg-white/50 text-slate-400 hover:bg-white hover:border-slate-200'}`}
           >
             <User2 className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-lg">我是女生</span>
           </button>
        </div>

        <button
          onClick={onStart}
          disabled={!gender}
          className={`w-full font-black py-4 px-8 rounded-2xl text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
            gender 
            ? 'bg-slate-800 text-white border-transparent hover:scale-[1.02] hover:shadow-xl' 
            : 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          {gender ? '开始深度测试' : '请先选择性别'}
        </button>
        
        <p className="text-xs text-slate-400 mt-6 font-mono tracking-widest uppercase">EST • 5-8 MINS</p>
      </div>
    </div>
  );
};

// Likert Scale (Unchanged)
const LikertScale = ({ 
  value, 
  onChange 
}: { 
  value: number | undefined, 
  onChange: (val: number) => void 
}) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto my-4 px-2 sm:px-4">
      <span className="text-xs font-bold text-emerald-500 uppercase hidden sm:block mr-2">同意</span>
      <div className="flex items-center justify-between flex-1 gap-1 sm:gap-3">
        <button onClick={() => onChange(3)} className={`rounded-full border-2 transition-all duration-200 ${value === 3 ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-md' : 'bg-transparent border-emerald-300 hover:bg-emerald-100'} w-12 h-12 md:w-14 md:h-14`} aria-label="Strongly Agree" />
        <button onClick={() => onChange(2)} className={`rounded-full border-2 transition-all duration-200 ${value === 2 ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-md' : 'bg-transparent border-emerald-300 hover:bg-emerald-100'} w-9 h-9 md:w-11 md:h-11`} aria-label="Agree" />
        <button onClick={() => onChange(1)} className={`rounded-full border-2 transition-all duration-200 ${value === 1 ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-md' : 'bg-transparent border-emerald-300 hover:bg-emerald-100'} w-7 h-7 md:w-8 md:h-8`} aria-label="Slightly Agree" />
        <button onClick={() => onChange(0)} className={`rounded-full border-2 transition-all duration-200 ${value === 0 ? 'bg-slate-300 border-slate-300 scale-110' : 'bg-transparent border-slate-300 hover:bg-slate-100'} w-5 h-5 md:w-6 md:h-6`} aria-label="Neutral" />
        <button onClick={() => onChange(-1)} className={`rounded-full border-2 transition-all duration-200 ${value === -1 ? 'bg-rose-400 border-rose-400 scale-110 shadow-md' : 'bg-transparent border-rose-300 hover:bg-rose-100'} w-7 h-7 md:w-8 md:h-8`} aria-label="Slightly Disagree" />
        <button onClick={() => onChange(-2)} className={`rounded-full border-2 transition-all duration-200 ${value === -2 ? 'bg-rose-400 border-rose-400 scale-110 shadow-md' : 'bg-transparent border-rose-300 hover:bg-rose-100'} w-9 h-9 md:w-11 md:h-11`} aria-label="Disagree" />
        <button onClick={() => onChange(-3)} className={`rounded-full border-2 transition-all duration-200 ${value === -3 ? 'bg-rose-400 border-rose-400 scale-110 shadow-md' : 'bg-transparent border-rose-300 hover:bg-rose-100'} w-12 h-12 md:w-14 md:h-14`} aria-label="Strongly Disagree" />
      </div>
      <span className="text-xs font-bold text-rose-500 uppercase hidden sm:block ml-2">反对</span>
    </div>
  );
};

// Quiz Screen (Unchanged)
const QuizScreen = ({ 
  questions, 
  answers,
  onAnswer,
  onFinish
}: { 
  questions: Question[], 
  answers: Record<number, number>,
  onAnswer: (qId: number, val: number) => void,
  onFinish: () => void
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;
  const canProceed = currentQuestions.every(q => answers[q.id] !== undefined);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      onFinish();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-64px)] bg-slate-50 pb-12 text-slate-800">
      <div className="sticky top-16 w-full bg-white/90 backdrop-blur z-10 shadow-sm border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
             <span>进度</span>
             <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-400 to-violet-400 h-2 rounded-full transition-all duration-500 ease-out shadow-sm" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl w-full px-4 py-8 space-y-12">
        {currentQuestions.map((q) => (
          <div key={q.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <h3 className="text-lg md:text-xl font-medium text-slate-700 text-center mb-8 leading-relaxed">{q.text}</h3>
            <LikertScale value={answers[q.id]} onChange={(val) => onAnswer(q.id, val)} />
            <div className="flex justify-between text-xs font-bold uppercase mt-4 px-2 sm:hidden">
              <span className="text-emerald-500">同意</span>
              <span className="text-rose-500">反对</span>
            </div>
          </div>
        ))}
        <div className="flex justify-center pt-6">
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform border-2 ${canProceed ? 'bg-slate-800 text-white border-transparent hover:scale-105 hover:shadow-xl' : 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'}`}
          >
            {currentPage === totalPages - 1 ? '查看结果' : '下一页'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Result Screen
const ResultScreen = ({ 
  profile, 
  onRetake,
  gender,
  imageCache,
  setImageCache
}: { 
  profile: PersonalityProfile, 
  onRetake: () => void,
  gender: Gender,
  imageCache: Record<string, string>,
  setImageCache: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const category = CATEGORIES[profile.category];
  const ProfileIcon = getIconComponent(profile.icon);
  const cacheKey = `${profile.code}_${gender}`;

  // Generate image on mount
  useEffect(() => {
    // Check cache first
    if (imageCache[cacheKey]) {
        setAvatarUrl(imageCache[cacheKey]);
        setIsLoading(false);
        return;
    }

    const fetchAvatar = async () => {
        setIsLoading(true);
        try {
            const url = await generateAvatar(profile, gender);
            setAvatarUrl(url);
            setImageCache(prev => ({ ...prev, [cacheKey]: url }));
        } catch (error) {
            console.error("Failed to generate avatar", error);
            // Optional: Set an error state or fallback
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchAvatar();
  }, [profile, gender, cacheKey, imageCache, setImageCache]);

  // Handle Regenerate logic
  const handleRegenerate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
        const url = await generateAvatar(profile, gender);
        setAvatarUrl(url);
        setImageCache(prev => ({ ...prev, [cacheKey]: url }));
    } catch (error) {
        console.error("Failed to regenerate avatar", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] w-full flex flex-col md:flex-row ${category.bg} transition-colors duration-700`}>
      
      {/* Left Column: Image Container (Fixed Width on Desktop, Aspect Ratio on Mobile) */}
      <div className="w-full md:w-1/3 lg:w-[450px] bg-white relative flex-shrink-0 shadow-2xl z-10 md:h-[calc(100vh-64px)] md:sticky md:top-16">
        {/* Style Overlay */}
        <div className={`absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-20 bg-gradient-to-b ${category.themeColor}`}></div>
        
        {/* Loading State Overlay */}
        {isLoading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                <Loader2 className={`w-12 h-12 animate-spin ${category.color} mb-4`} />
                <p className={`font-bold ${category.color} animate-pulse`}>正在为您的恋爱人格绘图...</p>
                <p className="text-xs text-slate-400 mt-2">AI 正在绘制马卡龙风格形象</p>
            </div>
        )}

        {/* Regenerate Button Overlay */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
             <button
                onClick={handleRegenerate}
                disabled={isLoading}
                title="重新生成形象"
                className={`p-2 rounded-full bg-white/70 backdrop-blur-md border border-white/50 text-slate-700 shadow-sm hover:bg-white transition-all disabled:opacity-50 ${category.color}`}
             >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
             </button>
        </div>

        {/* Image - Mobile uses strict aspect-ratio [9/16] to prevent cropping. Desktop fills height. */}
        <div className="w-full aspect-[9/16] md:h-full md:aspect-auto relative overflow-hidden bg-slate-200">
            {avatarUrl && !isLoading ? (
               <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover object-center animate-in fade-in duration-700" 
                style={{ filter: "brightness(105%) saturate(95%) contrast(95%)" }}
               />
            ) : null}
        </div>
        
        {/* Mobile-only overlay info (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 md:hidden bg-gradient-to-t from-white/90 to-transparent pointer-events-none">
             <h1 className="text-3xl font-black text-slate-800 mb-1">{profile.nickname}</h1>
             <p className={`font-bold ${category.color}`}>{profile.name}</p>
        </div>
      </div>

      {/* Right Column: Content (Scrollable) */}
      <div className="flex-1 max-w-4xl mx-auto p-6 md:p-12 md:overflow-y-auto">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/60 mb-8">
          <div className="flex justify-between items-start mb-6">
             <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white text-slate-700 border ${category.border} text-sm font-bold rounded-full mb-3 shadow-sm`}>
                   <span>{category.title}</span>
                   <span>•</span>
                   <span>{profile.code}</span>
                </div>
                <div className="flex items-center gap-3">
                    <h1 className="hidden md:block text-4xl font-black text-slate-800">{profile.nickname}</h1>
                    <div className={`p-2 bg-white rounded-lg border ${category.border} shadow-sm`}>
                        <ProfileIcon className={`w-6 h-6 ${category.color}`} />
                    </div>
                </div>
                <h2 className={`hidden md:block text-xl ${category.color} font-bold mt-2 opacity-80 mb-4`}>{profile.name}</h2>
                
                {/* Tags Display */}
                <div className="flex flex-wrap gap-2">
                    {profile.tags && profile.tags.map(tag => (
                        <span key={tag} className={`px-3 py-1 rounded-lg text-xs font-bold bg-white border ${category.border} ${category.color} shadow-sm`}>
                            #{tag}
                        </span>
                    ))}
                </div>
             </div>
             <button onClick={onRetake} className="text-slate-400 hover:text-slate-600 transition-colors flex flex-col items-center gap-1">
                <RefreshCw className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold">重测</span>
             </button>
          </div>

          <div className="space-y-6">
             <div className="relative mb-8">
                <Quote className="absolute -top-4 -left-2 w-8 h-8 text-slate-300 fill-current" />
                <p className="text-lg font-medium leading-relaxed text-slate-600 italic pl-6 border-l-4 border-slate-300">
                   "{profile.definition}"
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <AnalysisCard title="深度人格结构" content={profile.structure} icon={Brain} colorClass={category.color} borderClass={category.border} />
                 <AnalysisCard title="恋爱行为模式" content={profile.behavior} icon={Heart} colorClass={category.color} borderClass={category.border} />
                 <AnalysisCard title="优势特质" content={profile.strengths} icon={Sparkles} colorClass={category.color} borderClass={category.border} />
                 <AnalysisCard title="恋爱盲点" content={profile.blindSpots} icon={AlertTriangle} colorClass={category.color} borderClass={category.border} />
                 <AnalysisCard title="适合的伴侣" content={profile.partners} icon={Users} colorClass={category.color} borderClass={category.border} />
                 <AnalysisCard title="相处建议" content={profile.advice} icon={Lightbulb} colorClass={category.color} borderClass={category.border} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Logic (Unchanged) ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'dex'>('home');
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'result'>('welcome');
  
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [gender, setGender] = useState<Gender | null>(null);
  const [resultProfile, setResultProfile] = useState<PersonalityProfile | null>(null);
  
  // Image Cache Lifted to App Level to persist across tab switches
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  const startQuiz = () => {
    setAnswers({});
    setScreen('quiz');
  };

  const handleTabChange = (tab: 'home' | 'dex') => {
    setActiveTab(tab);
    if (tab === 'home') {
        // Stay on current screen
    } else {
        // Switch to Dex view
        window.scrollTo(0, 0);
    }
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateResult = () => {
    const scores: Record<DimensionType, number> = { 'EI': 0, 'NS': 0, 'FT': 0, 'AD': 0 };
    QUESTIONS.forEach(q => {
      const val = answers[q.id] || 0;
      scores[q.dimension] += (val * q.direction);
    });

    // Optimization: Ensure strict defaults for 0 scores.
    // > 0 maps to First Letter (E, N, F, A)
    // <= 0 maps to Second Letter (I, S, T, D)
    // This biases "ties" towards Introversion, Sensing, Thinking, and Dismissive/Avoidant.
    // This is a common psychometric convention to avoid 'ambiversion' in 16-type systems unless designed otherwise.
    
    const l1 = scores['EI'] > 0 ? 'E' : 'I';
    const l2 = scores['NS'] > 0 ? 'N' : 'S';
    const l3 = scores['FT'] > 0 ? 'F' : 'T';
    const l4 = scores['AD'] > 0 ? 'A' : 'D';

    const code = `${l1}${l2}${l3}${l4}`;
    const profile = PERSONALITIES[code] || PERSONALITIES['ENFA']; // Fallback
    setResultProfile(profile);
    setScreen('result');
    window.scrollTo(0,0);
  };

  const retakeQuiz = () => {
    setScreen('welcome');
    setAnswers({});
    setResultProfile(null);
    setGender(null); 
  };

  return (
    <div className="antialiased text-slate-700 font-sans min-h-screen flex flex-col bg-slate-50">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-grow">
        {activeTab === 'dex' ? (
           <TypeBrowser 
                imageCache={imageCache} 
                setImageCache={setImageCache} 
           />
        ) : (
            <>
                {screen === 'welcome' && (
                    <WelcomeScreen 
                        onStart={startQuiz} 
                        gender={gender}
                        setGender={setGender}
                    />
                )}
                
                {screen === 'quiz' && (
                    <QuizScreen 
                    questions={QUESTIONS}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onFinish={calculateResult}
                    />
                )}

                {screen === 'result' && resultProfile && gender && (
                    <ResultScreen 
                        profile={resultProfile} 
                        onRetake={retakeQuiz}
                        gender={gender}
                        imageCache={imageCache}
                        setImageCache={setImageCache}
                    />
                )}
            </>
        )}
      </main>
    </div>
  );
}