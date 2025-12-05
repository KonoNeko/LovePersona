import React, { useState, useEffect, useRef, useMemo } from 'react';
import { inject } from '@vercel/analytics';
import { Sparkles, Heart, RefreshCw, BookOpen, X, Info, Home, User2, ChevronRight, ChevronLeft, Quote, Zap, Shield, Compass, Dog, Flower2, Feather, Moon, Brain, Gamepad2, Scroll, Snowflake, ShieldAlert, Hammer, Sword, Briefcase, Sun, Wind, Cloud, Coffee, AlertTriangle, Lightbulb, Users, Search, Loader2, Download, Image as ImageIcon, FileImage, Share2, Link as LinkIcon, Check, MessageCircle, Battery, Wallet, Flame, Archive, Trash2, Calendar, ArrowRight, MoreVertical, GraduationCap, Library, Book, Copy, Menu, Palette, Clock, Layers } from 'lucide-react';
import { QUESTIONS, PERSONALITIES, CATEGORIES, ART_STYLES } from './constants';
import { DimensionType, PersonalityProfile, CategoryKey, Question, Gender, ArtStyleKey } from './types';
import { generateAvatar } from './services/geminiService';

const QUESTIONS_PER_PAGE = 6;
const STORAGE_KEY = 'lovePersona_history_v1';

interface SavedResult {
    id: number; // timestamp
    code: string;
    gender: Gender;
    date: string;
}

// ...existing code...
inject(); // 初始化 Vercel Analytics
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

// --- Helper: Add Watermark to Image ---
const addWatermarkToImage = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(imageUrl);
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Add watermark
            const watermarkText = 'LovePersona.vercel.app';
            const fontSize = Math.max(20, img.width * 0.04);
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 2;

            // Position watermark at bottom right
            const padding = 20;
            const textMetrics = ctx.measureText(watermarkText);
            const x = canvas.width - textMetrics.width - padding;
            const y = canvas.height - padding;

            ctx.strokeText(watermarkText, x, y);
            ctx.fillText(watermarkText, x, y);

            resolve(canvas.toDataURL('image/png'));
        };
        img.src = imageUrl;
    });
};

// --- Helper: Share Functionality ---
const handleShare = async (title: string, text: string, imageUrl?: string | null, shareUrl?: string) => {
    const websiteUrl = shareUrl || 'https://love-persona.vercel.app/';
    // Only copy the link to clipboard
    try {
        await navigator.clipboard.writeText(websiteUrl);
        // No alert, toast handled in TypeBrowser
    } catch (err) {
        // Optionally handle error toast in the future
    }
};

// --- Advanced Compatibility Analysis Engine ---

interface ScenarioAnalysis {
    title: string;
    icon: any;
    situation: string;
    challenge: string;
    advice: string;
}

interface MatchResult {
    score: number;
    tags: string[];
    summary: string;
    scenarios: ScenarioAnalysis[];
}

const analyzeCompatibility = (p1: PersonalityProfile, p2: PersonalityProfile): MatchResult => {
    let score = 60;
    let dynamics: string[] = [];
    const scenarios: ScenarioAnalysis[] = [];

    // Parse Dimensions
    const [p1E, p1N, p1F, p1A] = p1.code.split(''); // E/I, N/S, F/T, A/D
    const [p2E, p2N, p2F, p2A] = p2.code.split('');

    // --- Score Calculation Logic ---
    // 1. N/S Similarity (Communication Core) - High Weight
    if (p1N === p2N) {
        score += 15;
        dynamics.push("沟通顺畅");
    } else {
        score -= 5;
        dynamics.push("思维互补");
    }

    // 2. F/T Pairing (Conflict Style)
    if (p1F !== p2F) {
        score += 5; // Complementary is often good here
    }

    // 3. A/D Attachment (Crucial)
    const isAnxiousAvoidant = (p1A === 'A' && p2A === 'D') || (p1A === 'D' && p2A === 'A');
    const isSecureLike = (p1A === 'D' && p2A === 'D'); // Two avoidants are surprisingly stable/low drama
    const isExplosive = (p1A === 'A' && p2A === 'A');

    if (isAnxiousAvoidant) {
        score -= 15;
        dynamics.push("相爱相杀");
    } else if (isExplosive) {
        score += 5;
        dynamics.push("干柴烈火");
    } else {
        score += 10;
        dynamics.push("情绪稳定");
    }

    // Cap Score
    score = Math.min(98, Math.max(45, score));

    // --- Scenario 1: Emotional Needs (A/D Axis) ---
    // This defines the "Dance" of intimacy
    let s1: ScenarioAnalysis = {
        title: "情感需求与依恋模式",
        icon: Heart,
        situation: "",
        challenge: "",
        advice: ""
    };

    if (p1A === 'A' && p2A === 'A') {
        s1.situation = "两人都极度渴望亲密和确认。你们像两块强力磁铁，热恋期会24小时粘在一起，恨不得融为一体。";
        s1.challenge = "由于双方都缺乏安全感，一旦一方情绪低落，另一方会立刻恐慌，引发情绪共振和螺旋式爆发。容易演变成‘为了证明爱而通过作闹’的死循环。";
        s1.advice = "学会‘独立安抚’。当感到不安时，先试着自己消化5分钟，而不是立刻向对方索取确认。相信即使暂时不联系，爱依然存在。";
    } else if (p1A === 'D' && p2A === 'D') {
        s1.situation = "相敬如宾的模范室友。你们都非常尊重对方的边界，很少查岗，各自拥有独立的空间和爱好。";
        s1.challenge = "关系容易流于表面，缺乏深度的情感流动。遇到困难时，两人都习惯躲回自己的洞穴，导致问题被搁置而非解决，感情日渐冷淡。";
        s1.advice = "建立‘强制亲密时间’。比如每周五晚上必须放下手机进行深谈。偶尔的主动示弱不是软弱，而是对关系的信任。";
    } else if (isAnxiousAvoidant) {
        const anxious = p1A === 'A' ? "甲方" : "乙方";
        const avoidant = p1A === 'D' ? "甲方" : "乙方";
        s1.situation = "经典的‘追逃模式’。焦虑型（A）渴望更近一步，回避型（D）感到窒息而后退；D越退，A越追。";
        s1.challenge = "焦虑方觉得对方冷漠、不爱自己；回避方觉得对方歇斯底里、控制欲强。A在等一个解释，D在等一个安静。";
        s1.advice = `给回避型${avoidant}一个‘山洞’，但${avoidant}进洞前要告诉${anxious}：‘我现在需要休息，半小时后回来找你’。给焦虑型${anxious}确定的回应，而不是沉默。`;
    } else {
        s1.situation = "各种组合中较为平衡的状态。虽然依恋风格不同，但并未形成剧烈的冲突闭环。";
        s1.challenge = "在压力大时，可能会退行到各自的本能反应中，导致误解。";
        s1.advice = "观察对方在压力下的反应。如果TA沉默，就陪TA坐着；如果TA话多，就听TA说完。";
    }
    scenarios.push(s1);

    // --- Scenario 2: Communication Channel (N/S Axis) ---
    let s2: ScenarioAnalysis = {
        title: "沟通频道与思维同频",
        icon: MessageCircle,
        situation: "",
        challenge: "",
        advice: ""
    };

    if (p1N === p2N) {
        if (p1N === 'N') {
            s2.situation = "灵魂共鸣。你们能聊宇宙起源、人生哲学直到凌晨三点。对话充满了隐喻和跳跃，只有你们懂彼此的梗。";
            s2.challenge = "容易陷入空谈，忽略现实生活的细节。比如聊了一晚上的未来旅行计划，结果谁也没去订票。";
            s2.advice = "找一个‘落地执行官’，或者轮流负责把想法变成现实。多关注当下的柴米油盐，那也是浪漫的一部分。";
        } else {
            s2.situation = "务实高效。你们的对话围绕着‘今天吃什么’、‘周末去哪玩’等具体事务。沟通清晰直接，极少误解。";
            s2.challenge = "可能会觉得生活缺乏一点‘诗意’或深度。日复一日的琐事交流可能让激情消退得很快。";
            s2.advice = "定期进行一次‘非务实对话’。分享一个梦，或者讨论一部电影的深层含义，为关系注入精神养分。";
        }
    } else {
        // N vs S
        const N_Type = p1N === 'N' ? "甲方" : "乙方";
        const S_Type = p1N === 'S' ? "甲方" : "乙方";
        s2.situation = "跨频道交流。N型人兴致勃勃地谈论未来的宏大构想，S型人打断并询问‘那这事儿要花多少钱？’";
        s2.challenge = "N型觉得S型俗气、短视；S型觉得N型不切实际、好高骛远。N型觉得在对牛弹琴，S型觉得在听天书。";
        s2.advice = `N型${N_Type}尝试用具体的例子和步骤来表达愿景；S型${S_Type}试着多问一句‘那是什么感觉？’，先接纳情绪，再讨论逻辑。`;
    }
    scenarios.push(s2);

    // --- Scenario 3: Conflict Resolution (F/T Axis) ---
    let s3: ScenarioAnalysis = {
        title: "冲突爆发与解决机制",
        icon: Flame,
        situation: "",
        challenge: "",
        advice: ""
    };
    
    if (p1F === 'T' && p2F === 'T') {
        s3.situation = "理性辩论赛。吵架像是在开研讨会，双方都列举论据、分析逻辑，试图证明自己是‘对’的。";
        s3.challenge = "赢了道理，输了感情。过度的理性会让关系变得冷冰冰，忽略了彼此受伤的情绪。";
        s3.advice = "设置‘停火词’。当争论变成攻击时，暂停。记住，在亲密关系里，逻辑不是最高准则，感受才是。试着说：‘你是对的，但我很难过’。";
    } else if (p1F === 'F' && p2F === 'F') {
        s3.situation = "情绪风暴。争吵往往因为‘态度’而非‘事情’。双方都容易委屈、流泪，互相心疼又互相伤害。";
        s3.challenge = "容易把小事上升到‘你不爱我了’的高度。情绪淹没了解决问题的能力。";
        s3.advice = "就事论事。不要翻旧账，不要上升价值。情绪发泄完后，必须回归到问题本身：‘我们要怎么解决这个具体问题？’";
    } else {
        const F_Type = p1F === 'F' ? "甲方" : "乙方";
        const T_Type = p1F === 'T' ? "甲方" : "乙方";
        s3.situation = "鸡同鸭讲。F型在表达‘我很受伤’，T型在分析‘你为什么不应该受伤’。";
        s3.challenge = "F型觉得T型冷血、没人性；T型觉得F型无理取闹、情绪化。T型的解决方案在F型看来是忽视感受。";
        s3.advice = `T型${T_Type}先处理情绪，再处理事情。先给一个拥抱，说一句‘我理解你’。F型${F_Type}直接告诉T型你需要什么（拥抱还是建议），不要让他们猜。`;
    }
    scenarios.push(s3);

    // --- Scenario 4: Social & Energy (E/I Axis) ---
    let s4: ScenarioAnalysis = {
        title: "社交能量与生活节奏",
        icon: Battery,
        situation: "",
        challenge: "",
        advice: ""
    };

    if (p1E === p2E) {
        if (p1E === 'E') {
            s4.situation = "社交双子星。周末总是排满聚会，家里总是很热闹。你们是人群中的焦点。";
            s4.challenge = "容易忽视二人世界的深度独处。外部世界的喧嚣可能掩盖了内部的问题。";
            s4.advice = "留白。专门空出一天，关掉手机，只属于你们两个人。";
        } else {
            s4.situation = "宅家二人组。最完美的约会是一起窝在沙发上看电影，叫外卖。";
            s4.challenge = "生活圈子容易越来越窄，缺乏新鲜感的刺激。";
            s4.advice = "定期‘强行’出门。去一个新的地方，见新的朋友，给死水微澜的生活投一颗石子。";
        }
    } else {
        const E_Type = p1E === 'E' ? "甲方" : "乙方";
        const I_Type = p1E === 'I' ? "甲方" : "乙方";
        s4.situation = "互补的能量场。E型带I型看世界，I型给E型安稳的港湾。";
        s4.challenge = "E型想出去嗨，I型想在家躺。E型觉得I型闷，I型觉得E型吵。E型不仅消耗自己的电，还想借I型的充电宝。";
        s4.advice = "‘分头行动’也是一种爱。E型去聚会时，I型在家享受独处。回来后，E型分享见闻，I型负责倾听，各取所需。";
    }
    scenarios.push(s4);

    // --- Scenario 5: Future & Values (Derived) ---
    // Category Based
    let s5: ScenarioAnalysis = {
        title: "金钱观与未来规划",
        icon: Wallet,
        situation: "",
        challenge: "",
        advice: ""
    };

    if (p1.category === p2.category) {
        s5.situation = "价值观高度一致。你们对‘什么是重要的’有共识，无论是追求理想(NF)、追求真理(NT)还是追求安稳(ST)。";
        s5.challenge = "容易产生盲点叠加。比如两个NF都不理财，两个ST都过于保守错失机会。";
        s5.advice = "引入外部视角。如果是两个理想主义者，找个务实的朋友帮忙参考财务规划。";
    } else if ((p1.category === 'NF' && p2.category === 'ST') || (p1.category === 'ST' && p2.category === 'NF')) {
        s5.situation = "梦想家遇上实干家。NF描绘蓝图，ST计算成本。";
        s5.challenge = "NF觉得ST庸俗，ST觉得NF败家。在买房、投资等大事上容易产生严重分歧。";
        s5.advice = "NF负责定方向（去哪里），ST负责定路径（怎么去）。尊重彼此的功能，而不是互相贬低。";
    } else {
        s5.situation = "不同赛道的合伙人。你们关注的重点不同，但可以互补。";
        s5.challenge = "需要花费更多时间去解释自己的决策逻辑。";
        s5.advice = "建立共同账户用于公共支出，保留个人账户用于满足各自独特的消费偏好（比如一个买书，一个买装备）。";
    }
    scenarios.push(s5);

    return {
        score,
        tags: dynamics,
        summary: `你们的匹配度为 ${score}%。${scenarios[0].situation} ${scenarios[1].advice}`,
        scenarios
    };
};

// --- Helper: Image Download ---
const CATEGORY_COLORS: Record<string, string> = {
    NT: '#7c3aed', // violet-600
    NF: '#059669', // emerald-600
    ST: '#0284c7', // sky-600
    SF: '#e11d48'  // rose-600
};

const downloadImage = async (url: string, filename: string, profile: PersonalityProfile, withWatermark: boolean) => {
  try {
    if (!withWatermark) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw Original Image
    ctx.drawImage(img, 0, 0);

    // 2. Draw Gradient Background for Text (Subtle Dark)
    const gradientHeight = canvas.height * 0.2; 
    const gradient = ctx.createLinearGradient(0, canvas.height - gradientHeight, 0, canvas.height);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0.95)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height - gradientHeight, canvas.width, gradientHeight);

    // 3. Draw Watermark Text
    const accentColor = CATEGORY_COLORS[profile.category] || '#000000';
    
    // Config
    const paddingX = Math.floor(canvas.width * 0.05);
    const paddingY = Math.floor(canvas.height * 0.05);
    
    // Line 1: Code + Nickname
    const line1Size = Math.floor(canvas.width * 0.08); 
    ctx.font = `900 ${line1Size}px sans-serif`;
    ctx.textBaseline = "bottom";
    
    const line1Y = canvas.height - paddingY - (line1Size * 1.2);
    
    // Draw Code (e.g., ENFD)
    ctx.textAlign = "left";
    ctx.fillStyle = accentColor;
    ctx.fillText(`${profile.code}`, paddingX, line1Y);
    
    const codeWidth = ctx.measureText(profile.code).width;
    
    // Draw Nickname (e.g., 花蝴蝶)
    ctx.fillStyle = "#1e293b"; // Slate-800
    ctx.fillText(` (${profile.nickname})`, paddingX + codeWidth, line1Y);

    // Line 2: Name (e.g., 自在人情主义者)
    const line2Size = Math.floor(canvas.width * 0.045);
    ctx.font = `bold ${line2Size}px sans-serif`;
    ctx.fillStyle = "#64748b"; // Slate-500
    ctx.fillText(profile.name, paddingX, canvas.height - paddingY);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

// --- Component: Image Overlay Controls ---
const ImageControls = ({ isLoading, onRegenerate, imageUrl, profile, colorClass }: any) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSave = (withWatermark: boolean) => {
        if (imageUrl) downloadImage(imageUrl, `LovePersona_${profile.code}.png`, profile, withWatermark);
        setShowMenu(false);
    };

    return (
        <div className="absolute top-4 right-4 z-30 flex gap-2">
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    disabled={!imageUrl || isLoading}
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm text-slate-700 transition-all"
                    title="下载图片"
                >
                    <Download className="w-5 h-5" />
                </button>
                
                {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 animate-in fade-in zoom-in-95 origin-top-right z-50">
                        <button 
                            onClick={() => handleSave(false)} 
                            className="w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                        >
                            <ImageIcon className="w-4 h-4" /> 原图下载
                        </button>
                        <button 
                            onClick={() => handleSave(true)} 
                            className={`w-full text-left px-3 py-2 text-sm font-bold hover:bg-slate-50 rounded-lg flex items-center gap-2 ${colorClass}`}
                        >
                            <FileImage className="w-4 h-4" /> 水印下载
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={onRegenerate}
                disabled={isLoading}
                title="重绘"
                className={`p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all ${isLoading ? 'text-slate-400' : colorClass}`}
            >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>
    );
};

// --- Analysis Card ---
const AnalysisCard = ({ title, content, icon: Icon, colorClass, borderClass }: any) => (
  <div className={`bg-white border ${borderClass} rounded-2xl p-6`}>
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '50')} ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className={`text-lg font-bold ${colorClass}`}>{title}</h3>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
  </div>
);

// --- WelcomeScreen Component ---
const WelcomeScreen = ({ onStart, gender, setGender }: any) => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-indigo-100 max-w-2xl w-full border border-slate-100">
        <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 via-purple-500 to-indigo-600 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 via-purple-500 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-tr from-rose-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 fill-white text-white animate-pulse" />
            </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight">
            LovePersona AI
        </h1>
        <h2 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600 mb-6">
            AI 驱动的 MBTI 恋爱人格深度解析
        </h2>

         <div className="flex flex-wrap justify-center gap-3 mb-8">
             <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-sm font-bold text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4" /> 预计用时 3-5 分钟
             </div>
        </div>

        <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 rounded-2xl p-6 mb-10 max-w-lg mx-auto border border-rose-100">
            <p className="text-lg leading-relaxed">
                <span className="text-slate-700">基于深度心理学模型，</span>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600">生成你的专属定制 AI 形象</span>
                <span className="text-slate-700">。</span>
            </p>
            <p className="text-base text-slate-600 mt-3">
                揭示你在亲密关系中的真实模样、潜在盲点与最佳伴侣。
            </p>
        </div>

        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <button 
                    onClick={() => setGender('male')}
                    className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-300 text-slate-400'}`}
                >
                    <User2 className="w-6 h-6" />
                    <span>我是男生</span>
                </button>
                <button 
                    onClick={() => setGender('female')}
                    className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${gender === 'female' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 hover:border-slate-300 text-slate-400'}`}
                >
                    <User2 className="w-6 h-6" />
                    <span>我是女生</span>
                </button>
            </div>

            <button 
                onClick={onStart}
                disabled={!gender}
                className="w-full max-w-xs py-4 rounded-xl bg-slate-900 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200 transition-all flex items-center justify-center gap-2 mx-auto"
            >
                开始测试 <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    </div>
  </div>
);

// --- QuizScreen Component ---
const QuizScreen = ({ questions, answers, onAnswer, onFinish, onBack }: any) => {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const progress = ((Object.keys(answers).length) / questions.length) * 100;

    const currentQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);

    const handleNext = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
            window.scrollTo(0, 0);
        } else {
            onFinish();
        }
    };

    const isPageComplete = currentQuestions.every((q: any) => answers[q.id] !== undefined);

    const options = [
        { val: 3, label: "非常同意", color: "border-emerald-500", selectedColor: "bg-emerald-500" },
        { val: 2, label: "比较同意", color: "border-emerald-400", selectedColor: "bg-emerald-400" },
        { val: 1, label: "有点同意", color: "border-teal-400", selectedColor: "bg-teal-400" },
        { val: 0, label: "中立", color: "border-slate-300", selectedColor: "bg-slate-300" },
        { val: -1, label: "有点反对", color: "border-purple-300", selectedColor: "bg-purple-300" },
        { val: -2, label: "比较反对", color: "border-purple-400", selectedColor: "bg-purple-400" },
        { val: -3, label: "非常反对", color: "border-purple-500", selectedColor: "bg-purple-500" }
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 pb-20">
            {/* Progress Header */}
            <div className="sticky top-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button onClick={page === 0 ? onBack : () => setPage(page - 1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="text-sm font-bold text-slate-400 tabular-nums">
                        {Math.round(progress)}%
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-12">
                {currentQuestions.map((q: any, idx: number) => (
                    <div key={q.id} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                            {page * QUESTIONS_PER_PAGE + idx + 1}. {q.text}
                        </h3>
                        <div className="space-y-4 w-full">
                            <div className="flex justify-between items-center text-xs sm:text-sm font-bold px-2">
                                <span className="text-emerald-600">同意 Agree</span>
                                <span className="text-purple-600">反对 Disagree</span>
                            </div>
                            <div className="flex items-center justify-between w-full px-2 sm:px-4">
                                {options.map((opt, index) => {
                                    const isSelected = answers[q.id] === opt.val;
                                    // 渐进式大小变化：两端最大，往中间逐渐变小
                                    let size = '';
                                    if (index === 0 || index === 6) {
                                        size = 'w-14 h-14 sm:w-[70px] sm:h-[70px]'; // 最大
                                    } else if (index === 1 || index === 5) {
                                        size = 'w-12 h-12 sm:w-16 sm:h-16'; // 次大
                                    } else if (index === 2 || index === 4) {
                                        size = 'w-11 h-11 sm:w-[54px] sm:h-[54px]'; // 中等
                                    } else {
                                        size = 'w-10 h-10 sm:w-12 sm:h-12'; // 最小（中间）
                                    }
                                    
                                    return (
                                        <button
                                            key={opt.val}
                                            onClick={() => onAnswer(q.id, opt.val)}
                                            className="group relative"
                                            title={opt.label}
                                        >
                                            <div className={`${size} rounded-full border-[3px] transition-all duration-200 flex items-center justify-center ${
                                                isSelected 
                                                    ? `${opt.selectedColor} border-transparent scale-110 shadow-lg` 
                                                    : `bg-white ${opt.color} hover:scale-105 hover:shadow-md`
                                            }`}>
                                                {isSelected && (
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white"></div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-white px-2 py-1 rounded-md shadow-md z-10">
                                                {opt.label}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-12 flex justify-center">
                    <button
                        onClick={handleNext}
                        disabled={!isPageComplete}
                        className="px-12 py-4 rounded-xl bg-slate-900 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center gap-2"
                    >
                        {page < totalPages - 1 ? (
                             <>下一页 <ChevronRight className="w-5 h-5" /></>
                        ) : (
                             <>查看结果 <Sparkles className="w-5 h-5" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ResultScreen Component ---
const ResultScreen = ({ profile, gender, onRetake, imageCache, setImageCache, artStyle }: any) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [regenerateCount, setRegenerateCount] = useState(0);
    const [lastRegenerateTime, setLastRegenerateTime] = useState(0);
    const config = CATEGORIES[profile.category];
    const Icon = getIconComponent(profile.icon);

    // 防止重复生成的 ref
    const isGeneratingRef = useRef(false);

    useEffect(() => {
        const cacheKey = `${profile.code}_${gender}_${artStyle}`;
        if (imageCache[cacheKey]) {
            setAvatarUrl(imageCache[cacheKey]);
        } else if (!isGeneratingRef.current) {
            isGeneratingRef.current = true;
            const generate = async () => {
                setIsLoading(true);
                try {
                    const url = await generateAvatar(profile, gender, artStyle);
                    setAvatarUrl(url);
                    setImageCache((prev: any) => ({ ...prev, [cacheKey]: url }));
                } catch (e) { 
                    console.error(e);
                    alert('图片生成失败，请稍后重试');
                } finally { 
                    setIsLoading(false);
                    isGeneratingRef.current = false;
                }
            };
            generate();
        }
    }, [profile.code, gender, artStyle]);

    const handleRegenerate = async () => {
        // 防止连续点击
        if (isLoading || isGeneratingRef.current) {
            return;
        }

        const now = Date.now();
        const timeSinceLastRegenerate = now - lastRegenerateTime;
        
        // 频率限制：每次刷新间隔至少 3 秒
        if (timeSinceLastRegenerate < 3000 && lastRegenerateTime !== 0) {
            alert('请稍等片刻再刷新图片');
            return;
        }

        // 限制每分钟最多刷新 5 次
        if (regenerateCount >= 5 && timeSinceLastRegenerate < 60000) {
            alert('刷新次数过多，请稍后再试（每分钟最多5次）');
            return;
        }

        // 重置计数器（如果超过1分钟）
        if (timeSinceLastRegenerate >= 60000) {
            setRegenerateCount(0);
        }

        isGeneratingRef.current = true;
        setIsLoading(true);
        setLastRegenerateTime(now);
        setRegenerateCount(prev => prev + 1);

        try {
            const url = await generateAvatar(profile, gender, artStyle);
            setAvatarUrl(url);
            setImageCache((prev: any) => ({ ...prev, [`${profile.code}_${gender}_${artStyle}`]: url }));
        } catch (e) { 
            console.error(e);
            alert('图片生成失败，请稍后重试');
        } finally { 
            setIsLoading(false);
            isGeneratingRef.current = false;
        }
    };

    const [showCopiedToast, setShowCopiedToast] = useState(false);

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[80vh] flex flex-col xl:flex-row">
                 {/* Avatar Side */}
                 <div className="w-full xl:w-[400px] bg-slate-100 relative flex-none">
                     <div className="sticky top-0 h-full max-h-screen p-6 flex flex-col items-center justify-center">
                        <div className="relative aspect-[9/16] w-full max-w-sm rounded-2xl overflow-hidden bg-white shadow-lg">
                             {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                                    <Loader2 className={`w-10 h-10 animate-spin ${config.color}`} />
                                </div>
                            )}
                            {avatarUrl ? (
                                <img src={avatarUrl} className="w-full h-full object-cover" alt={profile.nickname} />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                    <Icon className="w-20 h-20" />
                                </div>
                            )}
                            <ImageControls 
                                isLoading={isLoading} 
                                onRegenerate={handleRegenerate} 
                                imageUrl={avatarUrl} 
                                profile={profile} 
                                colorClass={config.color} 
                            />
                        </div>
                        <button onClick={onRetake} className="mt-8 text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-2">
                             <RefreshCw className="w-4 h-4" /> 重测一次
                        </button>
                     </div>
                 </div>

                 {/* Content Side */}
                 <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider bg-white border ${config.border} ${config.color} shadow-sm`}>
                            {profile.category} SERIES
                        </span>
                        <div className="ml-auto flex gap-2">
                            <button 
                              onClick={async () => {
                                await handleShare(
                                  `LovePersona: ${profile.nickname}`,
                                  `我是${profile.nickname} (${profile.code}) - ${profile.name}。\n\n${profile.definition}`,
                                  avatarUrl,
                                  `https://love-persona.vercel.app/#${profile.code}`
                                );
                                setShowCopiedToast(true);
                                setTimeout(() => setShowCopiedToast(false), 2000);
                              }}
                              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-2 tracking-tighter">
                        {profile.nickname}
                    </h1>
                    <h2 className={`text-2xl font-bold ${config.color} mb-8`}>{profile.name} ({profile.code})</h2>
                    
                    <div className="flex flex-wrap gap-3 mb-10">
                        {profile.tags.map((tag: string) => (
                            <span key={tag} className={`px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 border border-slate-100 ${config.color}`}>
                                #{tag}
                            </span>
                        ))}
                    </div>

                     <div className="prose prose-slate max-w-none">

                    {/* Copied Toast for mobile/desktop */}
                    {showCopiedToast && (
                      <div
                        className="fixed left-1/2 bottom-8 z-50 px-6 py-3 rounded-full bg-black bg-opacity-80 text-white text-sm font-bold shadow-lg transform -translate-x-1/2 transition-all animate-in fade-in"
                        style={{ pointerEvents: 'none' }}
                      >
                        已复制链接
                      </div>
                    )}
                        <div className="bg-slate-50 border-l-4 border-slate-300 p-6 rounded-r-xl mb-10">
                            <p className="text-lg text-slate-700 italic m-0 font-medium leading-loose">"{profile.definition}"</p>
                        </div>

                        <div className="space-y-8">
                            <AnalysisCard 
                                title="深度人格结构" 
                                content={profile.structure} 
                                icon={Brain} 
                                colorClass={config.color} 
                                borderClass={config.border} 
                            />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnalysisCard 
                                    title="优势特质" 
                                    content={profile.strengths} 
                                    icon={Sparkles} 
                                    colorClass={config.color} 
                                    borderClass={config.border} 
                                />
                                <AnalysisCard 
                                    title="恋爱盲点" 
                                    content={profile.blindSpots} 
                                    icon={AlertTriangle} 
                                    colorClass={config.color} 
                                    borderClass={config.border} 
                                />
                            </div>
                            <AnalysisCard 
                                title="恋爱行为模式" 
                                content={profile.behavior} 
                                icon={Heart} 
                                colorClass={config.color} 
                                borderClass={config.border} 
                            />
                            <AnalysisCard 
                                title="相处建议" 
                                content={profile.advice} 
                                icon={Lightbulb} 
                                colorClass={config.color} 
                                borderClass={config.border} 
                            />
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

// --- Knowledge Screen Component ---
// ... (No Changes) ...
const KnowledgeScreen = () => {
    const [activeSection, setActiveSection] = useState<'dims' | 'books'>('dims');

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">亲密关系知识库</h2>
                    <p className="text-slate-500">理解爱的语言，探索人格的奥秘</p>
                </div>

                {/* Navigation Pills */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex">
                        <button 
                            onClick={() => setActiveSection('dims')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'dims' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Compass className="w-4 h-4" /> 维度解析
                        </button>
                        <button 
                            onClick={() => setActiveSection('books')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'books' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Library className="w-4 h-4" /> 书单推荐
                        </button>
                    </div>
                </div>

                {activeSection === 'dims' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Introduction */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <GraduationCap className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-xl font-bold text-indigo-900">什么是 LovePersona？</h3>
                            </div>
                            <p className="text-indigo-800/80 text-sm leading-relaxed">
                                LovePersona 系统结合了经典的 MBTI 人格理论与现代依恋心理学（Attachment Theory）。
                                我们认为，一个人在恋爱中的表现，不仅仅取决于性格（E/I, N/S, F/T），更深受依恋模式（A/D）的影响。
                                这个系统旨在帮助你理解自己和伴侣的核心需求与恐惧。
                            </p>
                        </div>

                        {/* Dimensions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* E vs I */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Zap className="w-4 h-4" /></div>
                                    <h4 className="font-bold text-slate-800">能量来源：E vs I</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="font-bold text-orange-500 block mb-1">E (Extraversion) 外向</span>
                                        <p className="text-xs text-slate-500 leading-relaxed">能量来源于外部世界。喜欢社交、表达和互动，通过与人相处来“充电”。在恋爱中通常更主动、爱表达。</p>
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-600 block mb-1">I (Introversion) 内向</span>
                                        <p className="text-xs text-slate-500 leading-relaxed">能量来源于内心世界。喜欢独处、深思和安静，社交会消耗能量。在恋爱中更注重深度交流和私人空间。</p>
                                    </div>
                                </div>
                            </div>

                            {/* N vs S */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Brain className="w-4 h-4" /></div>
                                    <h4 className="font-bold text-slate-800">信息处理：N vs S</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="font-bold text-purple-500 block mb-1">N (Intuition) 直觉</span>
                                        <p className="text-xs text-slate-500 leading-relaxed">关注未来、可能性和抽象概念。喜欢探讨意义、象征和宏大愿景。恋爱中看重精神契合和“感觉”。</p>
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-600 block mb-1">S (Sensing) 实感</span>
                                        <p className="text-xs text-slate-500 leading-relaxed">关注当下、现实细节和具体经验。相信五感所见，脚踏实地。恋爱中看重实际行动、生活照顾和物质基础。</p>
                                    </div>
                                </div>
                            </div>

                            {/* F vs T */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                                    <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><Heart className="w-4 h-4" /></div>
                                    <h4 className="font-bold text-slate-800">决策依据：F vs T</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="font-bold text-pink-500 block mb-1">F (Feeling) 情感</span>
                                        <p className="text-xs text-slate-500 leading-relaxed">决策基于价值观、和谐与他人感受。富有同情心，容易共情。在冲突中倾向于维护关系而非争论对错。</p>
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-600 block mb-1">T (Thinking) 理性</span>
                                        <p className="text-xs text-slate-500 leading-relaxed">决策基于逻辑、客观事实和原则。追求公平和效率，显得冷静甚至冷酷。在冲突中倾向于讲道理、解决问题。</p>
                                    </div>
                                </div>
                            </div>

                            {/* A vs D (Attachment) */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ring-2 ring-indigo-50">
                                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><LinkIcon className="w-4 h-4" /></div>
                                    <h4 className="font-bold text-slate-800">依恋模式：A vs D</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="font-bold text-rose-500 block mb-1">A (Anxious) 焦虑型</span>
                                        <p className="text-xs text-slate-500 leading-relaxed">渴望高浓度的亲密连接，对他人的情绪变化极度敏感。容易感到不安，需要伴侣反复的确认和陪伴。爱得热烈但也容易患得患失。</p>
                                    </div>
                                    <div>
                                        <span className="font-bold text-blue-500 block mb-1">D (Dismissive/Avoidant) 回避型</span>
                                        <p className="text-xs text-slate-500 leading-relaxed">极其看重独立空间和边界感。对过度的情绪卷入感到不适，习惯依靠自己。在压力下倾向于撤退或冷处理，看似冷淡实则自我保护。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Book Intro */}
                        <div className="bg-slate-100 rounded-2xl p-6 text-center">
                            <Quote className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-600 italic">"爱是一门艺术，需要知识和努力。" —— 埃里希·弗洛姆</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* General */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-slate-400"/> 通用必读</h4>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-slate-50 p-3 rounded-lg min-w-[60px] text-center font-serif font-bold text-slate-400">01</div>
                                        <div>
                                            <div className="font-bold text-slate-800">《非暴力沟通》(Nonviolent Communication)</div>
                                            <div className="text-xs text-slate-500 mt-1">马歇尔·卢森堡 · 学习如何不带攻击性地表达需求，是所有关系的基石。</div>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-slate-50 p-3 rounded-lg min-w-[60px] text-center font-serif font-bold text-slate-400">02</div>
                                        <div>
                                            <div className="font-bold text-slate-800">《亲密关系》(Intimacy)</div>
                                            <div className="text-xs text-slate-500 mt-1">克里斯多福·孟 · 揭示关系中的幻觉与真相，通往灵魂伴侣的必经之路。</div>
                                        </div>
                                    </li>
                                     <li className="flex gap-4 items-start">
                                        <div className="bg-slate-50 p-3 rounded-lg min-w-[60px] text-center font-serif font-bold text-slate-400">03</div>
                                        <div>
                                            <div className="font-bold text-slate-800">《读懂恋人心》(Attached)</div>
                                            <div className="text-xs text-slate-500 mt-1">阿米尔·莱文 · 科学解析依恋风格（焦虑/回避/安全），这一理论是本系统的核心基础。</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Categories Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* NF */}
                                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-emerald-700 mb-4">给 NF 理想外交家</h4>
                                    <ul className="space-y-3">
                                        <li className="text-sm text-slate-600"><span className="font-bold text-emerald-600">《爱的艺术》</span> - 弗洛姆：将爱提升到哲学高度，治愈你的理想主义焦虑。</li>
                                        <li className="text-sm text-slate-600"><span className="font-bold text-emerald-600">《少有人走的路》</span> - 派克：关于心智成熟与爱的真谛，适合深度思考的你。</li>
                                    </ul>
                                </div>

                                {/* NT */}
                                <div className="bg-white border border-violet-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-violet-700 mb-4">给 NT 理性分析家</h4>
                                    <ul className="space-y-3">
                                        <li className="text-sm text-slate-600"><span className="font-bold text-violet-600">《进化心理学》</span> - 戴维·巴斯：从生物进化角度剥离情感迷雾，理解两性博弈的底层逻辑。</li>
                                        <li className="text-sm text-slate-600"><span className="font-bold text-violet-600">《亲密关系中的博弈》</span> - 了解关系中的权力动态，避免过度理性化。</li>
                                    </ul>
                                </div>

                                {/* ST */}
                                <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-sky-700 mb-4">给 ST 务实守护者</h4>
                                    <ul className="space-y-3">
                                        <li className="text-sm text-slate-600"><span className="font-bold text-sky-600">《爱的五种语言》</span> - 查普曼：极具实操性的指南，教你用对方能听懂的方式去爱。</li>
                                        <li className="text-sm text-slate-600"><span className="font-bold text-sky-600">《男人来自火星，女人来自金星》</span> - 理解两性思维差异的经典，非常实用。</li>
                                    </ul>
                                </div>

                                {/* SF */}
                                <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-rose-700 mb-4">给 SF 感性探险家</h4>
                                    <ul className="space-y-3">
                                        <li className="text-sm text-slate-600"><span className="font-bold text-rose-600">《当下的力量》</span> - 托利：学会享受当下，减少对未来的焦虑或过去的情绪纠缠。</li>
                                        <li className="text-sm text-slate-600"><span className="font-bold text-rose-600">《霍乱时期的爱情》</span> - 马尔克斯：感受跨越半个世纪的极致浪漫与情感流动。</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- TypeBrowser Component ---
const TypeBrowser = ({ imageCache, setImageCache, artStyle }: any) => {
        const [showCopiedToast, setShowCopiedToast] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('NT');
    const [selectedCode, setSelectedCode] = useState<string>('ENTA'); // Default to first NT
    
    useEffect(() => {
        const firstInCat = Object.values(PERSONALITIES).find(p => p.category === selectedCategory);
        if (firstInCat && (!PERSONALITIES[selectedCode] || PERSONALITIES[selectedCode].category !== selectedCategory)) {
            setSelectedCode(firstInCat.code);
        }
    }, [selectedCategory]);

    // On mount, check hash for direct navigation
    useEffect(() => {
        if (window.location.hash) {
            const hashCode = window.location.hash.replace('#', '').toUpperCase();
            const profile = PERSONALITIES[hashCode];
            if (profile) {
                setSelectedCategory(profile.category);
                setSelectedCode(profile.code);
                setTimeout(() => {
                    const el = document.querySelector(`[data-profile-code='${profile.code}']`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 200);
            }
        }
    }, []);

    // When user selects a profile, update hash
    const handleSelectProfile = (code: string) => {
        setSelectedCode(code);
        window.location.hash = `#${code}`;
    };

    const profile = PERSONALITIES[selectedCode];
    const config = CATEGORIES[selectedCategory];
    const Icon = getIconComponent(profile.icon);

    const [dexGender, setDexGender] = useState<Gender>('female');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [regenerateCount, setRegenerateCount] = useState(0);
    const [lastRegenerateTime, setLastRegenerateTime] = useState(0);

    // 防止重复生成的 ref
    const isGeneratingRef = useRef(false);

    useEffect(() => {
        const cacheKey = `${profile.code}_${dexGender}_${artStyle}`;
        if (imageCache[cacheKey]) {
            setAvatarUrl(imageCache[cacheKey]);
        } else if (!isGeneratingRef.current) {
            setAvatarUrl(null);
            isGeneratingRef.current = true;
            const generate = async () => {
                setIsLoading(true);
                try {
                    const url = await generateAvatar(profile, dexGender, artStyle);
                    setAvatarUrl(url);
                    setImageCache((prev: any) => ({ ...prev, [cacheKey]: url }));
                } catch (e) { 
                    console.error(e);
                    alert('图片生成失败，请稍后重试');
                } finally { 
                    setIsLoading(false);
                    isGeneratingRef.current = false;
                }
            };
            generate();
        }
    }, [profile.code, dexGender, artStyle]);

    const handleRegenerate = async () => {
        // 防止连续点击
        if (isLoading || isGeneratingRef.current) {
            return;
        }

        const now = Date.now();
        const timeSinceLastRegenerate = now - lastRegenerateTime;
        
        // 频率限制：每次刷新间隔至少 3 秒
        if (timeSinceLastRegenerate < 3000 && lastRegenerateTime !== 0) {
            alert('请稍等片刻再刷新图片');
            return;
        }

        // 限制每分钟最多刷新 5 次
        if (regenerateCount >= 5 && timeSinceLastRegenerate < 60000) {
            alert('刷新次数过多，请稍后再试（每分钟最多5次）');
            return;
        }

        // 重置计数器（如果超过1分钟）
        if (timeSinceLastRegenerate >= 60000) {
            setRegenerateCount(0);
        }

        isGeneratingRef.current = true;
        setIsLoading(true);
        setLastRegenerateTime(now);
        setRegenerateCount(prev => prev + 1);

        try {
            const url = await generateAvatar(profile, dexGender, artStyle);
            setAvatarUrl(url);
            setImageCache((prev: any) => ({ ...prev, [`${profile.code}_${dexGender}_${artStyle}`]: url }));
        } catch (e) { 
            console.error(e);
            alert('图片生成失败，请稍后重试');
        } finally { 
            setIsLoading(false);
            isGeneratingRef.current = false;
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col">
            {/* Top Bar with Categories and Gender Toggle */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
                    {/* Gender Switch (Top on Mobile - Order 1) */}
                     <div className="flex items-center justify-end w-full md:w-auto p-2 md:p-0 order-1 md:order-2">
                         <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
                             <button onClick={() => setDexGender('male')} className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-6 py-2 rounded-md text-sm font-bold transition-all ${dexGender === 'male' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                <User2 className="w-4 h-4" /> 男生
                             </button>
                             <button onClick={() => setDexGender('female')} className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-6 py-2 rounded-md text-sm font-bold transition-all ${dexGender === 'female' ? 'bg-white shadow-sm text-pink-500' : 'text-slate-400 hover:text-slate-600'}`}>
                                <User2 className="w-4 h-4" /> 女生
                             </button>
                         </div>
                    </div>

                    {/* Categories (Bottom on Mobile - Order 2) */}
                    <div className="flex gap-6 md:gap-8 overflow-x-auto w-full md:w-auto min-w-0 no-scrollbar order-2 md:order-1 pt-0">
                        {(Object.keys(CATEGORIES) as CategoryKey[]).map(cat => {
                            const catConfig = CATEGORIES[cat];
                            const isActive = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex items-center gap-2 py-4 border-b-2 font-bold transition-all whitespace-nowrap ${
                                        isActive 
                                        ? `${catConfig.color} ${catConfig.border.replace('border-', 'border-b-')}` 
                                        : 'text-slate-400 border-transparent hover:text-slate-600'
                                    }`}
                                >
                                    {catConfig.iconColor && <Sparkles className={`w-4 h-4 ${isActive ? catConfig.iconColor : 'text-slate-300'}`} />}
                                    <span>{catConfig.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row">
                {/* Sidebar List */}
                <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 h-auto md:h-[calc(100vh-120px)] overflow-y-auto p-4 md:p-6 space-y-3">
                    {Object.values(PERSONALITIES)
                        .filter(p => p.category === selectedCategory)
                        .map(p => {
                            const pIcon = getIconComponent(p.icon);
                            const isActive = selectedCode === p.code;
                            return (
                                <div 
                                    key={p.code}
                                    data-profile-code={p.code}
                                    onClick={() => handleSelectProfile(p.code)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                                        isActive 
                                        ? `bg-white shadow-md shadow-slate-200 scale-100 border ${config.border}` 
                                        : 'hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-700 border border-transparent'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${isActive ? config.bg + ' ' + config.color : 'bg-slate-100'}`}>
                                        {React.createElement(pIcon, { className: "w-5 h-5" })}
                                    </div>
                                    <div>
                                        <div className={`font-bold ${isActive ? config.color : 'text-inherit'}`}>{p.nickname}</div>
                                        <div className="text-xs font-mono opacity-60">{p.code} · {p.name}</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 h-auto md:h-[calc(100vh-120px)] overflow-y-auto p-4 md:p-8 bg-white md:bg-transparent">
                    <div className="flex flex-col xl:flex-row gap-8 items-start">
                        
                        {/* Avatar Column */}
                        <div className="w-full xl:w-1/3 flex-none sticky top-0">
                            <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-white shadow-xl ring-4 ring-white">
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                                        <Loader2 className={`w-10 h-10 animate-spin ${config.color}`} />
                                    </div>
                                )}
                                {avatarUrl ? (
                                    <img src={avatarUrl} className="w-full h-full object-cover" alt={profile.nickname} />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <Icon className="w-20 h-20" />
                                    </div>
                                )}
                                <ImageControls 
                                    isLoading={isLoading} 
                                    onRegenerate={handleRegenerate} 
                                    imageUrl={avatarUrl} 
                                    profile={profile} 
                                    colorClass={config.color} 
                                />
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="flex-1 space-y-8 pb-12">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider bg-white border ${config.border} ${config.color} shadow-sm`}>
                                        {profile.category} SERIES
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider bg-slate-100 text-slate-500">
                                        {profile.code}
                                    </span>
                                                                        <button 
                                                                            onClick={async () => {
                                                                                await handleShare(
                                                                                    `LovePersona: ${profile.nickname}`,
                                                                                    `我是${profile.nickname} (${profile.code}) - ${profile.name}。\n\n${profile.definition}`,
                                                                                    avatarUrl,
                                                                                    `https://love-persona.vercel.app/#${profile.code}`
                                                                                );
                                                                                setShowCopiedToast(true);
                                                                                setTimeout(() => setShowCopiedToast(false), 2000);
                                                                            }}
                                                                            className="ml-auto p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="分享"
                                                                        >
                                                                            <Share2 className="w-5 h-5" />
                                                                        </button>
                                        {/* Copied Toast for mobile/desktop */}
                                        {showCopiedToast && (
                                            <div
                                                className="fixed left-1/2 bottom-8 z-50 px-6 py-3 rounded-full bg-black bg-opacity-80 text-white text-sm font-bold shadow-lg transform -translate-x-1/2 transition-all animate-in fade-in"
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                已复制链接
                                            </div>
                                        )}
                                </div>
                                <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-2 tracking-tight">
                                    {profile.nickname}
                                </h1>
                                <h2 className={`text-2xl font-bold ${config.color} mb-6`}>{profile.name}</h2>
                                
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {profile.tags.map(tag => (
                                        <span key={tag} className={`px-4 py-2 rounded-xl text-sm font-bold bg-white border ${config.border} ${config.color} shadow-sm`}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="border-l-4 border-slate-200 pl-6 py-2 mb-8">
                                    <p className="text-lg text-slate-600 italic leading-relaxed font-medium">
                                        "{profile.definition}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <AnalysisCard 
                                        title="AI锐评" 
                                        content={profile.roast} 
                                        icon={Zap} 
                                        colorClass={config.color} 
                                        borderClass={config.border} 
                                    />
                                    <AnalysisCard 
                                        title="深度人格结构" 
                                        content={profile.structure} 
                                        icon={Brain} 
                                        colorClass={config.color} 
                                        borderClass={config.border} 
                                    />
                                    <AnalysisCard 
                                        title="恋爱行为模式" 
                                        content={profile.behavior} 
                                        icon={Heart} 
                                        colorClass={config.color} 
                                        borderClass={config.border} 
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <AnalysisCard 
                                            title="优势特质" 
                                            content={profile.strengths} 
                                            icon={Sparkles} 
                                            colorClass={config.color} 
                                            borderClass={config.border} 
                                        />
                                        <AnalysisCard 
                                            title="恋爱盲点" 
                                            content={profile.blindSpots} 
                                            icon={AlertTriangle} 
                                            colorClass={config.color} 
                                            borderClass={config.border} 
                                        />
                                    </div>
                                    <AnalysisCard 
                                        title="相处建议" 
                                        content={profile.advice} 
                                        icon={Lightbulb} 
                                        colorClass={config.color} 
                                        borderClass={config.border} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MatchMaker Component ---
const MatchMaker = () => {
    const [p1Code, setP1Code] = useState<string>('ENFA');
    const [p2Code, setP2Code] = useState<string>('INTA');
    const [result, setResult] = useState<MatchResult | null>(null);
    const [showP1Picker, setShowP1Picker] = useState(false);
    const [showP2Picker, setShowP2Picker] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleAnalyze = () => {
        const p1 = PERSONALITIES[p1Code];
        const p2 = PERSONALITIES[p2Code];
        if (p1 && p2) {
            setResult(analyzeCompatibility(p1, p2));
            // 等待 DOM 更新后滚动到结果
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    // 人格选择器组件
    const PersonalityPicker = ({ selectedCode, onSelect, onClose }: { selectedCode: string; onSelect: (code: string) => void; onClose: () => void }) => {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
                <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                    <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-800">选择人格类型</h3>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                        {(Object.keys(CATEGORIES) as CategoryKey[]).map(catKey => {
                            const category = CATEGORIES[catKey];
                            const personalities = Object.values(PERSONALITIES).filter(p => p.category === catKey);
                            
                            return (
                                <div key={catKey} className="mb-8">
                                    <div className={`flex items-center gap-3 mb-4 pb-2 border-b-2 ${category.border}`}>
                                        <Sparkles className={`w-5 h-5 ${category.color}`} />
                                        <h4 className={`text-lg font-bold ${category.color}`}>{category.title}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {personalities.map(p => {
                                            const Icon = getIconComponent(p.icon);
                                            const isSelected = selectedCode === p.code;
                                            return (
                                                <button
                                                    key={p.code}
                                                    onClick={() => { onSelect(p.code); onClose(); }}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                                                        isSelected 
                                                            ? `${category.border} ${category.bg} scale-105 shadow-lg` 
                                                            : 'border-slate-100 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`p-1.5 rounded-lg ${isSelected ? category.color + ' bg-white' : category.bg}`}>
                                                            <Icon className={`w-4 h-4 ${isSelected ? '' : category.color}`} />
                                                        </div>
                                                        <span className={`text-xs font-black ${isSelected ? category.color : 'text-slate-400'}`}>{p.code}</span>
                                                    </div>
                                                    <div className={`font-bold text-sm mb-1 ${isSelected ? category.color : 'text-slate-700'}`}>{p.nickname}</div>
                                                    <div className="text-xs text-slate-500 line-clamp-1">{p.name}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">CP 匹配实验室</h2>
                    <p className="text-slate-500">模拟不同人格的恋爱化学反应</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        {/* P1 Selector */}
                        <div className="flex-1 w-full space-y-4">
                            <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">主角 A</label>
                            <button 
                                onClick={() => setShowP1Picker(true)}
                                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 hover:border-indigo-300 font-bold text-slate-700 transition-all text-left flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    {PERSONALITIES[p1Code] && (
                                        <>
                                            <div className={`p-2 rounded-lg ${CATEGORIES[PERSONALITIES[p1Code].category].bg}`}>
                                                {React.createElement(getIconComponent(PERSONALITIES[p1Code].icon), { 
                                                    className: `w-5 h-5 ${CATEGORIES[PERSONALITIES[p1Code].category].color}` 
                                                })}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={CATEGORIES[PERSONALITIES[p1Code].category].color}>{PERSONALITIES[p1Code].code}</span>
                                                    <span className="text-slate-700">{PERSONALITIES[p1Code].nickname}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            </button>
                            {PERSONALITIES[p1Code] && (
                                <div className={`p-4 rounded-xl border-l-4 ${CATEGORIES[PERSONALITIES[p1Code].category].bg} ${CATEGORIES[PERSONALITIES[p1Code].category].border}`}>
                                    <div className="text-xs font-bold opacity-50 mb-1">{PERSONALITIES[p1Code].name}</div>
                                    <div className="text-sm opacity-80 line-clamp-2">{PERSONALITIES[p1Code].definition}</div>
                                </div>
                            )}
                        </div>

                        {/* VS Icon */}
                        <div className="flex-none bg-slate-800 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-slate-50 z-20">
                            VS
                        </div>

                        {/* P2 Selector */}
                        <div className="flex-1 w-full space-y-4">
                            <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">主角 B</label>
                            <button 
                                onClick={() => setShowP2Picker(true)}
                                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 hover:border-indigo-300 font-bold text-slate-700 transition-all text-left flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    {PERSONALITIES[p2Code] && (
                                        <>
                                            <div className={`p-2 rounded-lg ${CATEGORIES[PERSONALITIES[p2Code].category].bg}`}>
                                                {React.createElement(getIconComponent(PERSONALITIES[p2Code].icon), { 
                                                    className: `w-5 h-5 ${CATEGORIES[PERSONALITIES[p2Code].category].color}` 
                                                })}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={CATEGORIES[PERSONALITIES[p2Code].category].color}>{PERSONALITIES[p2Code].code}</span>
                                                    <span className="text-slate-700">{PERSONALITIES[p2Code].nickname}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            </button>
                            {PERSONALITIES[p2Code] && (
                                <div className={`p-4 rounded-xl border-l-4 ${CATEGORIES[PERSONALITIES[p2Code].category].bg} ${CATEGORIES[PERSONALITIES[p2Code].category].border}`}>
                                    <div className="text-xs font-bold opacity-50 mb-1">{PERSONALITIES[p2Code].name}</div>
                                    <div className="text-sm opacity-80 line-clamp-2">{PERSONALITIES[p2Code].definition}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button 
                            onClick={handleAnalyze}
                            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                        >
                            <Flame className="w-6 h-6" /> 开始分析
                        </button>
                    </div>
                </div>

                {/* 人格选择器弹窗 */}
                {showP1Picker && <PersonalityPicker selectedCode={p1Code} onSelect={setP1Code} onClose={() => setShowP1Picker(false)} />}
                {showP2Picker && <PersonalityPicker selectedCode={p2Code} onSelect={setP2Code} onClose={() => setShowP2Picker(false)} />}

                {result && (
                    <div ref={resultRef} className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-500 scroll-mt-20">
                        {/* Score Card */}
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
                            <div className="relative z-10 text-center">
                                <div className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">匹配契合度</div>
                                <div className="text-7xl md:text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                                    {result.score}%
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center mb-6">
                                    {result.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm backdrop-blur-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                    {result.summary}
                                </p>
                            </div>
                        </div>

                        {/* Scenarios Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {result.scenarios.map((scenario, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <scenario.icon className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-bold text-slate-800">{scenario.title}</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">相处模式</div>
                                            <p className="text-sm text-slate-600">{scenario.situation}</p>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-rose-400 uppercase mb-1">潜在挑战</div>
                                            <p className="text-sm text-slate-600">{scenario.challenge}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-3 rounded-lg">
                                            <div className="text-xs font-bold text-indigo-500 uppercase mb-1">AI 建议</div>
                                            <p className="text-sm text-indigo-900/80 font-medium">{scenario.advice}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MyResultsScreen Component ---
const MyResultsScreen = ({ onSelectResult }: { onSelectResult: (code: string, gender: Gender) => void }) => {
    const [history, setHistory] = useState<SavedResult[]>([]);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            setHistory(data);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const clearHistory = () => {
        if(confirm('确定要清空所有历史记录吗？')) {
            localStorage.removeItem(STORAGE_KEY);
            setHistory([]);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 mb-1">我的测试历史</h2>
                        <p className="text-slate-500">回顾你的恋爱人格成长轨迹</p>
                    </div>
                    {history.length > 0 && (
                        <button onClick={clearHistory} className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors">
                            <Trash2 className="w-4 h-4" /> 清空
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">暂无测试记录</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {history.map((item) => {
                            const profile = PERSONALITIES[item.code];
                            if (!profile) return null;
                            const config = CATEGORIES[profile.category];
                            
                            return (
                                <button 
                                    key={item.id}
                                    onClick={() => onSelectResult(item.code, item.gender)}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all flex items-center gap-5 text-left group w-full"
                                >
                                    <div className={`w-16 h-16 rounded-xl ${config.bg} flex items-center justify-center text-2xl font-black ${config.color} shrink-0`}>
                                        {item.code}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-800 text-lg truncate">{profile.nickname}</span>
                                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-500">{item.gender === 'male' ? '男生' : '女生'}</span>
                                        </div>
                                        <div className="text-sm text-slate-500 truncate">{profile.name}</div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <div className="text-xs font-bold text-slate-400 flex items-center gap-1 justify-end mb-1">
                                            <Calendar className="w-3 h-3" /> {item.date}
                                        </div>
                                        <div className="text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-end">
                                            查看详情 <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'quiz' | 'result' | 'browser' | 'match' | 'knowledge' | 'history'>('welcome');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gender, setGender] = useState<Gender | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [resultProfile, setResultProfile] = useState<PersonalityProfile | null>(null);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const [artStyle, setArtStyle] = useState<ArtStyleKey>('anime');
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  const handleStartQuiz = () => {
    if (!gender) return;
    setAnswers({});
    setCurrentScreen('quiz');
  };

  const handleAnswer = (qId: number, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const calculateResult = () => {
    const scores: Record<DimensionType, number> = { EI: 0, NS: 0, FT: 0, AD: 0 };
    
    QUESTIONS.forEach(q => {
        const ans = answers[q.id] || 0;
        scores[q.dimension] += ans * q.direction;
    });

    const code = [
        scores.EI > 0 ? 'E' : 'I',
        scores.NS > 0 ? 'N' : 'S',
        scores.FT > 0 ? 'F' : 'T',
        scores.AD > 0 ? 'A' : 'D'
    ].join('');

    const profile = PERSONALITIES[code];
    setResultProfile(profile);

    if (profile && gender) {
        const historyItem: SavedResult = {
            id: Date.now(),
            code: code,
            gender: gender,
            date: new Date().toLocaleDateString()
        };
        try {
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            localStorage.setItem(STORAGE_KEY, JSON.stringify([historyItem, ...existing]));
        } catch (e) { console.error("Storage error", e); }
    }

    setCurrentScreen('result');
  };

  const handleSelectHistory = (code: string, g: Gender) => {
      if (PERSONALITIES[code]) {
        setResultProfile(PERSONALITIES[code]);
        setGender(g);
        setCurrentScreen('result');
      }
  };

  const navItems = [
    { id: 'welcome', label: '测试', icon: Home },
    { id: 'browser', label: '图鉴', icon: Book },
    { id: 'knowledge', label: '知识', icon: GraduationCap },
    { id: 'match', label: '匹配', icon: Users },
    { id: 'history', label: '我的', icon: User2 },
  ];

  const StyleSelectorModal = () => (
      <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-indigo-500" /> 全局画风选择
                  </h3>
                  <button onClick={() => setShowStyleSelector(false)} className="p-1 rounded-full hover:bg-slate-100">
                      <X className="w-5 h-5 text-slate-400" />
                  </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                  {(Object.keys(ART_STYLES) as ArtStyleKey[]).map(key => {
                      const style = ART_STYLES[key];
                      const isActive = artStyle === key;
                      return (
                          <button
                              key={key}
                              onClick={() => { setArtStyle(key); setShowStyleSelector(false); }}
                              className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${isActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}
                          >
                              <div className={`w-3 h-3 rounded-full mb-2 ${style.color}`} />
                              <div className={`text-sm font-bold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{style.label}</div>
                              {isActive && <div className="absolute top-2 right-2 text-indigo-500"><Check className="w-4 h-4" /></div>}
                          </button>
                      )
                  })}
              </div>
          </div>
      </div>
  );

  const Navbar = () => (
      <>
          {/* Desktop Navigation - Top */}
          <nav className="hidden md:block bg-white border-b border-slate-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                  {/* Logo */}
                  <div 
                      className="flex items-center gap-2 cursor-pointer group" 
                      onClick={() => { setCurrentScreen('welcome'); setIsMenuOpen(false); }}
                  >
                      <div className="bg-gradient-to-tr from-rose-500 to-indigo-600 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform">
                          <Heart className="w-4 h-4 fill-white" />
                      </div>
                      <span className="font-black text-lg tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">LovePersona</span>
                  </div>

                  {/* Desktop Menu */}
                  <div className="flex items-center gap-1">
                       {navItems.map(item => {
                           const isActive = currentScreen === item.id || (item.id === 'welcome' && (currentScreen === 'quiz' || currentScreen === 'result'));
                           return (
                               <button 
                                  key={item.id}
                                  onClick={() => setCurrentScreen(item.id as any)} 
                                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                               >
                                  <item.icon className="w-4 h-4" /> 
                                  <span>{item.label}</span>
                               </button>
                           );
                       })}
                       <div className="w-px h-6 bg-slate-200 mx-2"></div>
                       <button 
                            onClick={() => setShowStyleSelector(true)}
                            className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-2 font-bold text-sm"
                       >
                           <Palette className="w-4 h-4" /> 画风
                       </button>
                  </div>
              </div>
          </nav>

          {/* Mobile Top Bar - Simple Logo */}
          <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
              <div className="px-4 h-16 flex items-center justify-between">
                  <div 
                      className="flex items-center gap-2 cursor-pointer group" 
                      onClick={() => { setCurrentScreen('welcome'); }}
                  >
                      <div className="bg-gradient-to-tr from-rose-500 to-indigo-600 p-1.5 rounded-lg text-white">
                          <Heart className="w-4 h-4 fill-white" />
                      </div>
                      <span className="font-black text-lg tracking-tight text-slate-800">LovePersona</span>
                  </div>
                  <button 
                      onClick={() => setShowStyleSelector(true)}
                      className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                      <Palette className="w-5 h-5" />
                  </button>
              </div>
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-inset-bottom">
              <div className="flex justify-around items-center h-16 px-2">
                {navItems.map(item => {
                   const isActive = currentScreen === item.id || (item.id === 'welcome' && (currentScreen === 'quiz' || currentScreen === 'result'));
                   return (
                       <button 
                          key={item.id}
                          onClick={() => { setCurrentScreen(item.id as any); }} 
                          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all flex-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
                       >
                          <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                          <span className="text-xs font-bold whitespace-nowrap">{item.label}</span>
                       </button>
                   );
                })}
              </div>
          </nav>
      </>
  );

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen pb-20 md:pb-10 relative">
       <Navbar />
       {showStyleSelector && <StyleSelectorModal />}
       
       <main className="animate-in fade-in duration-300">
            {currentScreen === 'welcome' && (
                <WelcomeScreen 
                    onStart={handleStartQuiz} 
                    gender={gender} 
                    setGender={setGender} 
                />
            )}

            {currentScreen === 'quiz' && (
                <QuizScreen 
                    questions={QUESTIONS} 
                    answers={answers} 
                    onAnswer={handleAnswer} 
                    onFinish={calculateResult}
                    onBack={() => setCurrentScreen('welcome')}
                />
            )}

            {currentScreen === 'result' && resultProfile && (
                <ResultScreen 
                    profile={resultProfile} 
                    gender={gender}
                    onRetake={() => setCurrentScreen('welcome')}
                    imageCache={imageCache}
                    setImageCache={setImageCache}
                    artStyle={artStyle}
                />
            )}

            {currentScreen === 'browser' && (
                <TypeBrowser 
                    imageCache={imageCache}
                    setImageCache={setImageCache}
                    artStyle={artStyle}
                />
            )}

            {currentScreen === 'match' && <MatchMaker />}
            
            {currentScreen === 'knowledge' && <KnowledgeScreen />}

            {currentScreen === 'history' && (
                <MyResultsScreen onSelectResult={handleSelectHistory} />
            )}
       </main>
    </div>
  );
};

export default App;