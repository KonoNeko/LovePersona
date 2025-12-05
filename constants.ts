import { CategoryKey, PersonalityMap, Question, Gender, ArtStyleKey } from './types';

// Direction 1: Agree = First Letter (E, N, F, A), -1 = Second Letter (I, S, T, D)

export const ART_STYLES: Record<ArtStyleKey, { label: string; prompt: string; color: string }> = {
  anime: {
    label: "日漫赛璐璐",
    prompt: "Cel-shaded anime style. Flat colors, bold outlines, 2D illustration, clean linework, vibrant flat shading, solid colors, no gradients, pure anime aesthetic with clear cel-shading technique.",
    color: "bg-blue-500"
  },
  manhwa: {
    label: "韩漫唯美",
    prompt: "Cel-shaded Korean Webtoon style. Flat sophisticated aesthetic, clean bold outlines, solid vibrant colors, flat shading, stylized beautiful faces, no gradients, modern flat illustration.",
    color: "bg-pink-500"
  },
  gufeng: {
    label: "中国古风",
    prompt: "Cel-shaded Chinese Ancient Style. Flat traditional aesthetic, flowing Hanfu robes with solid colors, clean outlines, flat pastel colors, simplified elegant design, no gradients, flat artistic rendering.",
    color: "bg-emerald-500"
  },
  hongkong: {
    label: "复古港风",
    prompt: "Cel-shaded Hong Kong Retro style. Bold flat contours, heavy ink outlines, solid neon or sunset colors, flat dramatic lighting, 90s flat aesthetic, clean shapes, no gradients, posterized vintage look.",
    color: "bg-amber-600"
  }
};

export const CATEGORIES: Record<CategoryKey, { title: string; subtitle: string; color: string; bg: string; border: string; glow: string; iconColor: string; themeColor: string }> = {
  NT: {
    title: "理性分析家 (Analysts)",
    subtitle: "以智慧与逻辑驾驭爱情的谋略者",
    color: "text-violet-600",
    bg: "bg-violet-50", 
    border: "border-violet-200",
    glow: "shadow-violet-200",
    iconColor: "text-violet-500",
    themeColor: "from-violet-100 to-purple-50"
  },
  NF: {
    title: "理想外交家 (Diplomats)",
    subtitle: "寻求灵魂共鸣与深层连接的理想主义者",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    glow: "shadow-emerald-200",
    iconColor: "text-emerald-500",
    themeColor: "from-emerald-100 to-teal-50"
  },
  ST: {
    title: "务实守护者 (Sentinels)",
    subtitle: "守护秩序、责任与安全感的坚实伴侣",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    glow: "shadow-sky-200",
    iconColor: "text-sky-500",
    themeColor: "from-sky-100 to-blue-50"
  },
  SF: {
    title: "感性探险家 (Explorers)",
    subtitle: "活在当下、体验情感流动的浪漫生活家",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    glow: "shadow-rose-200",
    iconColor: "text-rose-500",
    themeColor: "from-rose-100 to-pink-50"
  }
};

// --- 32 Static Images Placeholder Structure ---
// Once you provide the files, these paths will map to your local folder.
// For now, I'm keeping the Unsplash links as placeholders so the app doesn't break,
// but I've updated the structure to be easily replaceable with "/assets/ENFA_male.png" etc.

const getLocalOrRemote = (filename: string, fallbackUrl: string) => {
  // In a real local build, this would be: return `/assets/avatars/${filename}`;
  return fallbackUrl; 
}

export const AVATAR_DB: Record<string, Record<Gender, string>> = {
  // ... (rest of the file remains unchanged)
  // --- NF Group (Teal/Green Theme) ---
  ENFA: {
    // 黏人小狗 (Sticky Dog) - Updated to Macaron Style
    // Replace the placeholders below with the URLs of the images you uploaded.
    male: getLocalOrRemote("ENFA_male.png", "YOUR_UPLOADED_IMAGE_2_URL_HERE"), // Image: Boy in Pink Hoodie (Sitting)
    female: getLocalOrRemote("ENFA_female.png", "YOUR_UPLOADED_IMAGE_3_URL_HERE") // Image: Girl with Dog Ears
  },
  ENFD: {
    // 花蝴蝶 (Flower Butterfly) - Updated to Macaron Style
    // Replace the placeholders below with the URLs of the images you uploaded.
    male: getLocalOrRemote("ENFD_male.png", "YOUR_UPLOADED_IMAGE_1_URL_HERE"), // Image: Boy with Butterflies
    female: getLocalOrRemote("ENFD_female.png", "YOUR_UPLOADED_IMAGE_4_URL_HERE") // Image: Girl with Butterflies
  },
  INFA: {
    male: getLocalOrRemote("INFA_male.png", "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("INFA_female.png", "https://images.unsplash.com/photo-1506543730435-e2c164552133?auto=format&fit=crop&w=800&q=80")
  },
  INFD: {
    male: getLocalOrRemote("INFD_male.png", "https://images.unsplash.com/photo-1515286259024-c10444d3261f?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("INFD_female.png", "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80")
  },
  // --- NT Group (Purple/Indigo Theme) ---
  ENTA: {
    male: getLocalOrRemote("ENTA_male.png", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ENTA_female.png", "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80")
  },
  ENTD: {
    male: getLocalOrRemote("ENTD_male.png", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ENTD_female.png", "https://images.unsplash.com/photo-1485218126466-34e6392ec754?auto=format&fit=crop&w=800&q=80")
  },
  INTA: {
    male: getLocalOrRemote("INTA_male.png", "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("INTA_female.png", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80")
  },
  INTD: {
    male: getLocalOrRemote("INTD_male.png", "https://images.unsplash.com/photo-1484186139897-d5fc6b908812?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("INTD_female.png", "https://images.unsplash.com/photo-1530785602389-07594beb8b73?auto=format&fit=crop&w=800&q=80")
  },
  // --- ST Group (Sky/Blue Theme) ---
  ESTA: {
    male: getLocalOrRemote("ESTA_male.png", "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ESTA_female.png", "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?auto=format&fit=crop&w=800&q=80")
  },
  ESTD: {
    male: getLocalOrRemote("ESTD_male.png", "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ESTD_female.png", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80")
  },
  ISTA: {
    male: getLocalOrRemote("ISTA_male.png", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ISTA_female.png", "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80")
  },
  ISTD: {
    male: getLocalOrRemote("ISTD_male.png", "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ISTD_female.png", "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=800&q=80")
  },
  // --- SF Group (Rose/Pink Theme) ---
  ESFA: {
    male: getLocalOrRemote("ESFA_male.png", "https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ESFA_female.png", "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=800&q=80")
  },
  ESFD: {
    male: getLocalOrRemote("ESFD_male.png", "https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ESFD_female.png", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80")
  },
  ISFA: {
    male: getLocalOrRemote("ISFA_male.png", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ISFA_female.png", "https://images.unsplash.com/photo-1516575334481-f85287c2c81d?auto=format&fit=crop&w=800&q=80")
  },
  ISFD: {
    male: getLocalOrRemote("ISFD_male.png", "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80"),
    female: getLocalOrRemote("ISFD_female.png", "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80")
  }
};

export const PERSONALITIES: PersonalityMap = {
  // ... (content remains the same)
  // --- NF Group (Idealists/Diplomats) ---
  ENFA: {
     roast: "谈个恋爱像 24 小时情感客服，手机一震就以为世界要塌，不回消息五分钟就开始在脑内排练分手现场。你一边说自己很好哄，一边用情绪压测对方的耐心极限。不是没人爱你，是先被你这场高频预警给吓跑了。",
    code: "ENFA",
    name: "热情浪漫主义者",
    nickname: "黏人小狗",
    tags: ["情绪雷达", "浪漫制造机", "粘人精"],
    category: "NF",
    icon: "Dog",
    definition: "热情外向、富于幻想，渴望亲密的关注和陪伴。对爱充满憧憬，全心投入，但由于内心不安，需要大量安全感和回应。",
    structure: "你的内在如同一团燃烧的火焰，由外向（E）的情感能量和直觉（N）的浪漫幻想驱动。焦虑型依恋（A）使你在关系中极度渴望融合，情感（F）导向则让你将伴侣的感受视为世界的中心。你拥有极其丰富的情感雷达。",
    behavior: "你是那个会凌晨三点为爱人写诗、突然出现在对方楼下给惊喜的人。你喜欢高频率的联系，希望每一刻都与对方分享。如果伴侣回应冷淡，你会迅速开启“侦探模式”，分析自己哪里做错了。",
    strengths: "无可比拟的热情与投入，能为关系注入源源不断的活力。你极具共情能力，是天生的治愈者，能敏锐察觉伴侣的需求并给予最温暖的支持。",
    blindSpots: "过度依赖伴侣的情绪反馈，容易患得患失。有时会因为过度脑补而制造不存在的矛盾。你的爱太满，有时会让需要空间的伴侣感到窒息。",
    partners: "① INTJ (恋爱人格: INTA/INTD)：智者型伴侣。他们的冷静与稳定能安抚你的焦虑，你也能用热情融化他们的坚冰。② INFJ (恋爱人格: INFA)：灵魂伴侣。同样追求深层精神连接，能给你最渴望的理解和回应。",
    advice: "学会“情感独立”，明白独处不代表被抛弃。给自己和对方一点空间，你的光芒会更吸引人。当感到焦虑时，先深呼吸，确认事实再反应。"
  },
  ENFD: {
    roast: "你把暧昧当兴趣爱好，把承诺当高危投资，谁靠近你都可以先试用七天无理由退货。聊天像在开见面会，人人都觉得自己是特别来宾，其实只是随机观众。最后说自己‘难以被理解’，其实只是懒得负责。",
    code: "ENFD",
    name: "自在人情主义者",
    nickname: "花蝴蝶",
    tags: ["自由灵魂", "社交达人", "惊喜盲盒"],
    category: "NF",
    icon: "Butterfly",
    definition: "魅力四射，想象力丰富，热衷浪漫但崇尚自由。在爱情中投入热情但不受束缚，倾向享受当下而非长久承诺。",
    structure: "外向（E）与直觉（N）的结合赋予你无穷的魅力与创造力，而回避型依恋（D）则是你保护自我的盔甲。你追求灵魂的共鸣，但当关系触及你内心最深处的自由边界时，你会本能地后撤。",
    behavior: "你是社交场上的焦点，总能带给伴侣新鲜刺激的体验。你喜欢探索未知的约会地点和话题。但当伴侣试图用规则或承诺束缚你时，你会像蝴蝶一样滑走，保持微妙的距离。",
    strengths: "风趣幽默，充满惊喜，能让平淡的生活变得五彩斑斓。你尊重伴侣的独立性，不会进行情感绑架，能与伴侣建立轻松愉悦的朋友式恋人关系。",
    blindSpots: "对承诺的恐惧可能让伴侣感到不安。在遇到深层冲突时，你倾向于逃避或转移话题，而不是解决问题。有时会让人觉得“走肾不走心”。",
    partners: "① INTJ (恋爱人格: INTD)：独立策划者。他们尊重边界，不会粘着你，同时思想深度能吸引你。② ENTP (恋爱人格: ENTD)：灵魂玩伴。你们能一起探索世界，保持智力上的刺激和相处的轻松感。",
    advice: "试着在关系中多停留一会儿，深度的亲密关系需要穿越恐惧。告诉伴侣你的界限，而不是直接消失。真正的自由是在爱中依然能做自己。"
  },
  INFA: {
    roast: "你是恋爱里的自虐编剧，所有细节都能被你脑补成三十集虐恋大剧。明明委屈到睡不着，还能反过来心疼对方太辛苦不忍心责怪。嘴上说没事，日记本和歌单已经替你办完了追悼会。",
    code: "INFA",
    name: "敏感理想家",
    nickname: "痴情诗人",
    tags: ["纯爱战神", "敏感细腻", "默默奉献"],
    category: "NF",
    icon: "Feather",
    definition: "内向敏感，富于幻想，渴望深沉真挚的爱情，内心情感炽热但表达含蓄。在亲密关系中既投入又容易不安。",
    structure: "内向（I）构建了你深邃的内心世界，直觉（N）让你对爱有理想化的滤镜。情感（F）与焦虑依恋（A）的结合，使你成为爱的信徒，但也让你在关系中如同惊弓之鸟，极易受伤。",
    behavior: "你爱得小心翼翼又深沉如海。你可能不会大声说爱，但会把爱写进日记、画进画里。你对伴侣的微表情极其敏感，常因为对方一个皱眉而内耗一整天。",
    strengths: "极致的温柔与包容，拥有看透灵魂的洞察力。你对伴侣的忠诚度和牺牲精神令人动容，能构建出极具精神深度的亲密连接。",
    blindSpots: "容易过度美化伴侣，忽视现实问题。习惯压抑自己的需求来讨好对方，最后因委屈而爆发。情绪波动大，需要伴侣不断的安抚。",
    partners: "① ENTJ (恋爱人格: ENTA)：强势指挥官。他们能带领你，给你缺乏的安全感和决断力。② ENFJ (恋爱人格: ENFA)：温暖主人公。他们能敏锐察觉你的情绪，并主动给予肯定和关爱。",
    advice: "勇敢表达你的需求，伴侣不是读心术师。停止自我攻击，你的敏感是天赋而非缺陷。建立自己的生活支点，不要把全部重心放在关系上。"
  },
  INFD: {
    roast: "你热爱灵魂交流，但习惯把灵魂锁在小黑屋，给别人看的是高冷精修版。一句‘我还好’背后能写出十万字长篇独白，却指望别人一眼看穿。你不是神秘，是沟通成本高得离谱。",
    code: "INFD",
    name: "矜持浪漫主义者",
    nickname: "高冷诗人",
    tags: ["神秘主义", "灵魂伴侣", "慢热"],
    category: "NF",
    icon: "Moon",
    definition: "理想主义且富有同理心，但性格矜持内敛。在爱情中向往灵魂契合却害怕受伤，往往保持神秘距离来保护自己。",
    structure: "你就像月亮，拥有丰富的情感（F）和理想（N），但回避依恋（D）让你习惯隐藏阴暗面。你渴望被理解，却又害怕被看穿，这种矛盾构成了你神秘的吸引力。",
    behavior: "慢热是你的常态。在关系初期，你会设立重重考验。你喜欢深度的精神交流，但一旦感觉对方过于侵入你的私人领地，你会瞬间冷淡下来，躲回自己的壳里。",
    strengths: "独立而深邃，拥有独特的艺术气质和精神世界。你尊重伴侣的隐私，从不无理取闹。一旦认定，你的爱是深沉而持久的，专注于灵魂的契合。",
    blindSpots: "过度的防御机制可能让真爱擦肩而过。你的冷淡常被误解为不在乎。在面对冲突时习惯冷战，这会极大消耗关系的温度。",
    partners: "① ENFP (恋爱人格: ENFD)：热情竞选者。他们的热情足以融化你的冰山，同时理解你的理想主义。② INTP (恋爱人格: INTD)：逻辑学家。同样需要空间，能在精神层面产生深刻共鸣，相处无压力。",
    advice: "试着卸下一小块面具，让伴侣看到你的脆弱。脆弱不是软弱，而是连接的桥梁。当你想逃跑时，告诉对方“我需要一点时间”，而不是直接断联。"
  },

  // --- NT Group (Rationalists/Analysts) ---
  ENTA: {
    roast: "你谈恋爱一定要有路线图、KPI 和复盘会，连吵架都像在开策略会议。对方一个表情你都能延展出三种可能性、五个解决方案，最后把自己卷到心力交瘁。你想要的是安心，但实际输出的是压力。",
    code: "ENTA",
    name: "理性浪漫策划者",
    nickname: "脑补大师",
    tags: ["恋爱军师", "细节控", "嘴硬心软"],
    category: "NT",
    icon: "Brain",
    definition: "思维活跃且理性务实，在爱情中善于计划和分析，但内心带有不安倾向，经常过度思虑恋情的发展和细节。",
    structure: "外向直觉（EN）让你思维跳跃，理性（T）让你追求逻辑，但焦虑依恋（A）是个变数。你试图用逻辑去解构感性的爱情，这种冲突让你经常陷入“脑补”的循环。",
    behavior: "你会像做项目一样经营爱情，制定详细的发展计划。如果伴侣偏离了计划或反应不如预期，你会开始分析成因：“他是不是不爱我了？是因为我昨天说了那句话吗？”。",
    strengths: "聪明机智，善于解决问题。你会为了两人的未来付出实际的努力和规划。你的爱充满了成长的动力，会推动伴侣一起变得更好。",
    blindSpots: "过度理性化情感，由于不安全感，可能会通过争论或智力压制来索取关注。容易因为细节而忽略了大局，陷入精神内耗。",
    partners: "① INFJ (恋爱人格: INFA)：温和提倡者。他们能包容你的奇思妙想，用深度的情感洞察安抚你的焦虑。② ISFJ (恋爱人格: ISFA)：忠诚守卫者。他们的稳定和细节关怀能让你那颗悬着的心落地。",
    advice: "爱情不是数学题，没有标准答案。停止过度分析伴侣的微表情。学会直接表达“我需要抱抱”，而不是通过辩论来博取关注。"
  },
  ENTD: {
    roast: "你把暧昧聊成博弈论实战，把试探当 A/B 测试，永远站在情绪制高点俯视全场。别人刚刚动心，你这边已经开始规划体面退出方案。嘴上说不需要谁，结果半夜刷完所有情感博主评论区。",
    code: "ENTD",
    name: "自由理性主义者",
    nickname: "恋爱玩家",
    tags: ["挑战者", "理性至上", "独立人格"],
    category: "NT",
    icon: "Gamepad2",
    definition: "独立自信，社交能力强，追求新鲜刺激和思想共鸣的恋爱体验，抗拒被规则和承诺束缚，更注重自我实现。",
    structure: "自信的外向（E）与理性的思考（T）让你在情场游刃有余。回避依恋（D）让你将独立视为最高准则。你追求的是势均力敌的博弈，而非卿卿我我的依附。",
    behavior: "你喜欢挑战和智力游戏，甚至会故意挑起争论来测试伴侣。你非常迷人但难以掌控，一旦感觉关系变得乏味或沉重，你会毫不犹豫地抽身寻找新的刺激。",
    strengths: "极具个人魅力，自信坦率。你不会被情绪勒索，能保持关系的清晰和边界。和你在一起，生活永远充满挑战和成长的机会。",
    blindSpots: "容易忽略伴侣的情感需求，显得冷酷无情。对承诺的抗拒可能伤害真心爱你的人。将 vulnerablity（脆弱）视为弱点，难以建立深层亲密。",
    partners: "① INTJ (恋爱人格: INTD)：势均力敌。你们是典型的“双强”组合，既是恋人又是战友，无需多言便懂彼此。② INFP (恋爱人格: INFD)：温柔调停者。他们的柔性能中和你的锐利，同时不会给你施加现实的压力。",
    advice: "聪明不代表智慧，在感情中适当“糊涂”一点。尝试去理解伴侣的情绪逻辑，而不是只讲道理。承诺不是束缚，而是深层体验的开始。"
  },
  INTA: {
    roast: "你在脑子里和对方从相识、热恋、争吵到分手都演了一遍，现实中还卡在要不要回一句‘嗯’。你自认为理性克制，实际上是把所有需求藏进被动里，等别人来破译密码。错过机遇的时候，连懊悔都要先分析个原因归类。",
    code: "INTA",
    name: "忧虑分析者",
    nickname: "闷骚军师",
    tags: ["深情内敛", "忠诚守护", "醋坛子"],
    category: "NT",
    icon: "Scroll",
    definition: "聪明内敛，理性善分析，但对感情充满隐忧。在爱情中习惯谋定后动、暗自观察，一旦缺乏安全感就容易陷入过度思虑。",
    structure: "内向思考（IT）让你习惯在内心构建世界，焦虑依恋（A）则在这个世界里埋下了不安的种子。你像一个谨慎的棋手，每走一步都要推演伴侣的十步反应。",
    behavior: "表面云淡风轻，内心戏十足。你会暗中观察伴侣的一举一动，收集数据来验证对方是否爱你。如果伴侣回应积极，你会默默付出；若回应冷淡，你会陷入自我怀疑的死循环。",
    strengths: "深思熟虑，忠诚可靠。你一旦承诺，就会负责到底。你善于为伴侣提供理性的建议和实际的帮助，是生活中最坚实的后盾。",
    blindSpots: "沟通被动，习惯让人猜。过度谨慎导致不敢投入，错失良机。容易把伴侣的无心之举解读为负面信号，自己吓自己。",
    partners: "① ENFP (恋爱人格: ENFA)：阳光竞选者。他们热情似火，能打破你的心防，主动表达爱意，让你安心。② ESFP (恋爱人格: ESFA)：快乐表演者。他们的直率和快乐能把你从过度思考中拉出来，享受当下。",
    advice: "把你脑子里的分析说出来，哪怕只有十分之一。伴侣看不到你的内心戏。相信直觉，有时候爱不需要那么多证据，只需要感受。"
  },
  INTD: {
    roast: "你把情绪压缩成只读文件，把亲密关系做成长线投资，波动太大直接斩仓止损。对浪漫的态度是：能不发生就不发生，发生了也当生活噪音处理。别人费劲巴拉试图靠近，你冷静得像在审核对方的入库资格。",
    code: "INTD",
    name: "独立思想者",
    nickname: "冰山学者",
    tags: ["智性恋", "独行侠", "极简主义"],
    category: "NT",
    icon: "Snowflake",
    definition: "独立冷静，思想深邃，重视理性和自我。在恋爱中保持高度自制和距离感，不轻易流露情感，追求精神层面的连接。",
    structure: "内向（I）、直觉（N）、理性（T）与回避依恋（D）的组合，打造了你强大的精神堡垒。你视理智为神，视情绪为洪水猛兽。你追求的是绝对的独立和精神契合。",
    behavior: "你像一座冰山，只展露冰山一角。你不喜欢黏腻的日常，更愿意和伴侣讨论宇宙起源。你需要大量的独处空间，对伴侣的情绪爆发往往感到不知所措甚至厌烦。",
    strengths: "情绪稳定，逻辑清晰。你尊重伴侣的独立性，从不控制。你的爱虽然不热烈，但极具深度和稳定性，是伴侣最冷静的智囊。",
    blindSpots: "情感隔离严重，让伴侣感觉不到被爱。在冲突中习惯冷暴力。过度理智可能让你失去体验爱的能力，把关系变成冷冰冰的契约。",
    partners: "① ENTP (恋爱人格: ENTD)：智慧辩手。能跟上你的思维跳跃，理解你的精神世界，且不会情绪化。② ENFJ (恋爱人格: ENFA)：温暖向导。他们能用高情商包容你的冷淡，并引导你从理智走向情感。",
    advice: "情感不是弱点，而是人类的本能。试着每天表达一点点感受，比如“我很开心”。给伴侣一个拥抱，有时候肢体语言比道理更有用。"
  },

  // --- ST Group (Sentinels/Realists) ---
  ESTA: {
    roast: "你一谈恋爱就自动切换到安保负责人模式，把‘保护’和‘掌控’打包当成深情。查岗查到对方连天气都不敢随便发朋友圈，吃哪家饭都要提前报备。你口头禅是‘我都是为你好’，但对方只听到了‘你最好听我的’。",
    code: "ESTA",
    name: "强势保护者",
    nickname: "护短狮子",
    tags: ["霸道总裁", "护犊子", "行动派"],
    category: "ST",
    icon: "ShieldAlert",
    definition: "直率果断，重视实际行动来经营感情，喜欢主导和保护另一半。内心缺乏安全感，因而对伴侣高度忠诚也略显控制欲。",
    structure: "外向实感（ES）让你活在当下且行动力强，焦虑依恋（A）则转化为强烈的保护欲和控制欲。你通过“掌控”来获得安全感，认为爱就是负责和保护。",
    behavior: "你是霸道总裁式的恋人。你会安排好约会的一切，解决伴侣的所有麻烦。但如果伴侣脱离了你的掌控，或者对其他人表现出兴趣，你的醋坛子会瞬间打翻，表现出强烈的占有欲。",
    strengths: "行动力爆表，给伴侣十足的安全感和依靠。你爱憎分明，护短，绝不允许外人欺负你的伴侣。你的承诺重于泰山。",
    blindSpots: "大男子/大女子主义，容易忽略伴侣的想法。把控制当成爱，让伴侣感到窒息。脾气急躁，容易在冲突中说狠话伤人。",
    partners: "① ISFJ (恋爱人格: ISFA)：温柔守卫者。他们欣赏你的强大，愿意被你保护，且能提供你需要的忠诚。② ISFP (恋爱人格: ISFD)：艺术探险家。他们的柔顺和艺术气质能激发你的保护欲，且互补。",
    advice: "爱是放手，不是抓紧。尊重伴侣的独立意志，不要替对方做决定。学会温柔地表达脆弱，而不是用愤怒来掩饰不安。"
  },
  ESTD: {
    roast: "你是人形日程表，适合结婚过日子但严重不适合拍偶像剧。纪念日会忘，生日礼物能买成保温杯，再配一句‘实用一点不好吗’。你把所有情绪都简化成‘忙’和‘还行’，然后惊讶于为什么氛围总是那么冷清。",
    code: "ESTD",
    name: "冷静执行者",
    nickname: "钢铁直男/女",
    tags: ["靠谱老实人", "直球选手", "工作狂"],
    category: "ST",
    icon: "Hammer",
    definition: "务实稳健，有强烈责任感，把爱情视作生活责任的一部分踏实经营。情感表达含蓄克制，追求独立自主的相处模式。",
    structure: "现实（S）与理性（T）让你脚踏实地，回避依恋（D）让你在情感上保持疏离。你把爱情看作一种社会契约或生活合作，看重效率和结果多于情感体验。",
    behavior: "你不懂浪漫，但很懂生活。你会按时交工资卡，修好家里的水管，但可能记不住纪念日。你不喜欢猜测伴侣的心思，觉得那是浪费时间。你更喜欢各自独立，搭伙过日子的模式。",
    strengths: "极度靠谱，情绪稳定。你构建的生活坚实稳固，能为家庭提供物质保障。你做事有条理，不会因为情绪化而把生活搞砸。",
    blindSpots: "缺乏情趣，像个机器人。对伴侣的情感需求视而不见，认为“矫情”。在情感交流上的缺失可能导致关系日渐枯燥，最终走向疏远。",
    partners: "① ISTJ (恋爱人格: ISTA)：传统物流师。三观一致，都追求稳定和务实，是最佳的生活合伙人。② ESFP (恋爱人格: ESFD)：活跃表演者。他们的活力能为你的生活注入色彩，带动你享受人生。",
    advice: "买花不浪费钱，那是对关系的投资。试着倾听伴侣的抱怨而不是马上给解决方案。情感账户需要定期储蓄，否则会破产。"
  },
  ISTA: {
    roast: "你爱得很久，但表达得像系统默认静音，所有在意都体现在一些没人注意到的小细节里。吵架的时候嘴上一句话都不肯说，心里已经反复写了十遍检讨和十遍控诉。你以为自己是在维持体面，对方只觉得你在冷淡放弃。",
    code: "ISTA",
    name: "忠诚守卫者",
    nickname: "闷骚骑士",
    tags: ["细节怪", "承诺千金", "守旧派"],
    category: "ST",
    icon: "Sword",
    definition: "内敛踏实，责任心强，以守护伴侣为己任。表达爱意含蓄稳重，内心深处害怕失去而格外忠诚，有时显得固执。",
    structure: "内向实感（IS）让你念旧且保守，焦虑依恋（A）让你对关系的变动极度敏感。你像一个守城的骑士，死守着承诺和回忆，害怕任何改变带来的风险。",
    behavior: "你默默付出，记得伴侣随口说的一句话。你会反复确认关系的状态，对伴侣的行踪很在意。如果发生争吵，你会陷入长久的沉默和自我纠结中，但绝不会轻易提分手。",
    strengths: "忠诚度满分，细心周到。你是最适合结婚的对象，能把日子过得井井有条。你的爱虽然无声，但沉甸甸的，充满了细节的温暖。",
    blindSpots: "固执己见，不愿改变。容易钻牛角尖，把小事放大。过度谨慎可能让你显得无趣。因为害怕失去，有时会表现出隐形的控制欲。",
    partners: "① ESFP (恋爱人格: ESFA)：快乐源泉。他们的乐观能中和你的悲观，带你体验新事物。② ESTJ (恋爱人格: ESTA)：强势管理者。他们能给你明确的方向和安全感，让你感到踏实。",
    advice: "接受改变，改变不代表失去。不要把情绪闷在心里，学会说“我害怕”。多尝试新鲜事物，给稳固的关系加点调味剂。"
  },
  ISTD: {
    roast: "你擅长把生活过得井井有条，也擅长把感情冷处理到只剩安排和义务。喜欢的人不敢追，不喜欢的人懒得回，久而久之把自己活成感情免打扰模式。你以为这是高级独立，对方看起来更像被拒之门外的外来人员。",
    code: "ISTD",
    name: "独立实干者",
    nickname: "冰山劳模",
    tags: ["独处爱好者", "务实主义", "距离感"],
    category: "ST",
    icon: "Briefcase",
    definition: "自主稳健，极度自律，偏好以实际行动而非浪漫形式投入感情。在关系中保持理性克制，重视彼此独立和长期承诺。",
    structure: "内向（I）、现实（S）、理性（T）与回避依恋（D）造就了你极简主义的爱情观。你独立自主，不需要依靠任何人，也希望伴侣如此。你用行动而非语言来定义关系。",
    behavior: "你喜欢独处，对过度的亲密感到不适。你通过完成责任来表达爱，比如赚钱养家。你很少表露情感，面对伴侣的煽情可能会感到尴尬。你追求的是一种相敬如宾的距离感。",
    strengths: "冷静客观，自律高效。你从不给伴侣添麻烦，也能妥善处理危机。你的爱是实实在在的物质支持和生活保障，经得起时间的考验。",
    blindSpots: "冷漠疏离，容易让伴侣感到被忽视。缺乏共情能力，难以理解伴侣的情绪。过于独立，让伴侣觉得自己是多余的。",
    partners: "① ESTJ (恋爱人格: ESTD)：高效执行者。你们互相欣赏对方的效率和独立，相处高效无累赘。② ISFJ (恋爱人格: ISFA)：温婉守卫者。他们的包容能接纳你的冷淡，并默默照顾你的生活。",
    advice: "人是情感动物，不是机器。试着每天哪怕花10分钟和伴侣进行纯粹的情感交流。偶尔的依赖不是软弱，而是信任的表现。"
  },

  // --- SF Group (Explorers/Connectors) ---
  ESFA: {
    roast: "你把自己活成移动充电宝，对谁都想先冲一百分的热情，结果电量耗光了才发现没人给你插充电头。一点小细节都能让你在心里开十次全体大会，表面还在笑着说‘没事我真的不介意’。你不是不会拒绝，是习惯先辜负自己。",
    code: "ESFA",
    name: "忠诚守护者",
    nickname: "黏人小太阳",
    tags: ["气氛组", "奉献型", "夸夸群主"],
    category: "SF",
    icon: "Sun",
    definition: "外向友善，务实体贴，对伴侣极度忠诚和投入，喜欢时时相伴照顾，对关系充满责任感，同时内心敏感，害怕被忽视。",
    structure: "外向情感（EF）让你天生渴望连接，焦虑依恋（A）让你把自我价值建立在被需要上。你是爱的发光体，但光芒需要他人的反射才能确认自己的存在。",
    behavior: "你是最贴心的伴侣，嘘寒问暖，无微不至。你喜欢粘着对方，分享一切。如果伴侣情绪低落，你会比他还难过，并想尽办法逗他开心。你极度渴望赞美和肯定。",
    strengths: "热情洋溢，乐于奉献。你是家庭的粘合剂，能营造出温馨和谐的氛围。你极具同理心，能让伴侣感受到被深深地爱着和在乎着。",
    blindSpots: "讨好型人格，没有底线。容易情绪化，把伴侣的情绪当成自己的责任。过度付出后如果得不到回报，会产生强烈的怨恨。",
    partners: "① ISTJ (恋爱人格: ISTA)：靠谱物流师。他们的稳重给你安全感，你也能温暖他们。② ISFJ (恋爱人格: ISFA)：温柔同盟。你们都看重情感维护，能建立一段互相关怀、极度温馨的关系。",
    advice: "爱别人之前先爱自己。你的价值不取决于你为对方做了什么。学会独处，学会拒绝。并不是所有的情绪都需要你去负责。"
  },
  ESFD: {
    roast: "你是行走的人形气氛组，谁难过都能被你捞一捞，但真到自己出事只会笑着说‘没事啦去玩吧’。你擅长把尴尬化解成笑点，也擅长把问题躺平成‘算了算了’，最后连自己到底在意什么都模糊了。别人觉得你好相处，却没几个真懂你。",
    code: "ESFD",
    name: "随和照顾者",
    nickname: "中央空调",
    tags: ["快乐源泉", "随遇而安", "和事佬"],
    category: "SF",
    icon: "Wind",
    definition: "开朗体贴，踏实务实，乐于照顾他人但不喜欢束缚。在亲密关系中态度随和顺其自然，既给予温暖又保持适度距离。",
    structure: "外向（E）与现实（S）让你活在当下的快乐中，回避依恋（D）让你在享受亲密的同时保持着随时可以撤退的轻松感。你不喜欢沉重的话题。",
    behavior: "你是天生的玩伴，幽默风趣。你对伴侣很好，但对朋友也很好，界限模糊。你喜欢轻松的恋爱，一旦面临逼婚或深层矛盾，你会打哈哈混过去，或者选择逃避。",
    strengths: "乐观豁达，适应力强。和你在一起没有任何压力，全是快乐的回忆。你善于化解尴尬，能把平凡的日子过得有滋有味。",
    blindSpots: "缺乏深度，回避问题。让人觉得不专一，缺乏安全感。习惯用快乐掩饰问题，导致关系停留在浅层，难以建立深层连接。",
    partners: "① ESTP (恋爱人格: ESTD)：冒险企业家。你们是最佳玩伴，一起追求刺激，互不束缚。② ISFP (恋爱人格: ISFD)：佛系艺术家。相处轻松自然，都注重当下的感受，没有压迫感。",
    advice: "偶尔深入谈谈心不会死人的。明确朋友和恋人的界限。面对冲突，尝试解决一次，你会发现深层关系带来的满足感远超浅层的快乐。"
  },
  ISFA: {
    roast: "你是感情里的软糯防风林，什么风都先往自己身上兜一圈，生怕别人受一点委屈。明明早就累到想大哭一场，嘴上还是习惯性说‘我可以的别担心’。你把懂事当盔甲，但它首先伤到的永远是你自己。",
    code: "ISFA",
    name: "温柔守护者",
    nickname: "小绵羊",
    tags: ["治愈系", "顺从温和", "倾听者"],
    category: "SF",
    icon: "Cloud",
    definition: "温和善良，踏实可靠，习惯默默付出照顾伴侣。内心依恋但害羞，被动等待关爱又容易敏感不安，需要大量肯定。",
    structure: "内向情感（IF）让你内心丰富但外表安静，焦虑依恋（A）让你极度渴望依附。你像一只温顺的小羊，寻找一个强大的牧羊人，愿意为此付出所有的温柔。",
    behavior: "你总是默默地做很多事，比如把家里打扫干净，做好饭菜等待。你不敢表达需求，生怕麻烦对方。你对伴侣的语气很敏感，容易独自流泪，等着对方来哄。",
    strengths: "极致的温柔，艺术家的感知力。你是最包容的倾听者，能给伴侣提供最舒适的情感避风港。你的爱纯粹而细腻，没有攻击性。",
    blindSpots: "过度隐忍，容易积压情绪导致爆发。缺乏主见，过度依赖。容易在关系中失去自我，变成伴侣的附属品。",
    partners: "① ESTJ (恋爱人格: ESTA)：强势守护。他们能为你做决定，给你依靠，你也很乐意配合。② ENFJ (恋爱人格: ENFA)：人生导师。他们鼓励你表达，发现你的优点，让你变得自信。",
    advice: "你的感受同样重要，大声说出来。不要用“懂事”来委屈自己。建立自信，你值得被爱，不仅仅是因为你顺从，而是因为你是你。"
  },
  ISFD: {
    roast: "你在感情里贯彻‘不主动不拒绝不负责’的佛系美学，连吵架都懒得投入情绪。遇到问题第一反应是拖一拖，再拖一拖，拖到大家都以为你无所谓。你说顺其自然，但自然界都比你更有点反馈。",
    code: "ISFD",
    name: "温和自持者",
    nickname: "佛系伴侣",
    tags: ["生活家", "不争不抢", "舒适圈"],
    category: "SF",
    icon: "Coffee",
    definition: "真诚随和，体贴但有界限感。在感情中不爱纠缠，追求平和稳定的相处，遇事冷静处理，给爱人自由也保留自我。",
    structure: "内向（I）、现实（S）、情感（F）与回避依恋（D）的结合，让你成为生活美学家。你追求内心的平静与和谐，讨厌戏剧化的冲突。你用距离来维持美感。",
    behavior: "你随和但有底线。你喜欢和伴侣待在一起，但各自做喜欢的事。你不喜欢争吵，遇到矛盾会躲开，等冷静了再说。你很少承诺未来，更看重今天过得开不开心。",
    strengths: "情绪平稳，极具包容力。你有独特的生活品味，能把日子过成诗。你尊重伴侣，从不控制，相处起来如沐春风。",
    blindSpots: "过于被动，缺乏进取心。逃避冲突导致问题积压。让人觉得若即若离，难以走进内心。有时候显得过于懒散，缺乏规划。",
    partners: "① ESFJ (恋爱人格: ESFA)：热情执政官。他们会主动照顾你，带动你的生活热情。② ESFP (恋爱人格: ESFD)：快乐源泉。他们能带你走出舒适圈，体验新鲜事物，且不会给你压力。",
    advice: "偶尔的主动会让伴侣感到惊喜。不要把冷战当作解决问题的方式。分享你的内心世界，让爱流动起来，而不仅仅是陪伴。"
  }
};

export const QUESTIONS: Question[] = [
  // ... (content remains the same)
  // --- Dimension 1: Extraversion (E) vs Introversion (I) ---
  { id: 1, text: "在一天忙碌的工作后，我更倾向于和伴侣出去聚会而不是在家安静休息。", dimension: 'EI', direction: 1 },
  { id: 2, text: "我喜欢把我的伴侣介绍给我的所有朋友，并经常组织多人聚会。", dimension: 'EI', direction: 1 },
  { id: 3, text: "在恋爱初期，我通常比较被动，等待对方开启话题或邀约。", dimension: 'EI', direction: -1 },
  { id: 4, text: "我如果不与伴侣分享我发生的每一件事，就会觉得心里憋得慌。", dimension: 'EI', direction: 1 },
  { id: 5, text: "我认为两个人在一起，即使不说话各做各的事，也是最舒服的状态。", dimension: 'EI', direction: -1 },
  { id: 6, text: "在公共场合表达爱意（如牵手、拥抱）让我感到有些不自在。", dimension: 'EI', direction: -1 },
  { id: 7, text: "我很容易在约会中开启新的话题，避免冷场。", dimension: 'EI', direction: 1 },
  { id: 8, text: "我更喜欢一对一的深度交流，而不是和另一半去热闹的夜店或派对。", dimension: 'EI', direction: -1 },
  { id: 9, text: "当我遇到开心的事，我会立刻发朋友圈或打电话告诉另一半，恨不得全世界知道。", dimension: 'EI', direction: 1 },
  { id: 10, text: "我需要大量的独处时间来为自己“充电”，即使是在热恋期。", dimension: 'EI', direction: -1 },
  { id: 11, text: "在社交场合，我通常会让伴侣来主导对话。", dimension: 'EI', direction: -1 },
  { id: 12, text: "我认为理想的周末是充满各种社交活动和户外探险的。", dimension: 'EI', direction: 1 },

  // --- Dimension 2: Intuition (N) vs Sensing (S) ---
  { id: 13, text: "我经常幻想我们未来的生活场景，甚至包括很久以后的细节。", dimension: 'NS', direction: 1 },
  { id: 14, text: "比起昂贵但不实用的浪漫惊喜，我更喜欢伴侣帮我解决一个实际的生活难题。", dimension: 'NS', direction: -1 },
  { id: 15, text: "由于过度沉浸在对爱情的理想化想象中，我有时会忽略现实中的阻碍。", dimension: 'NS', direction: 1 },
  { id: 16, text: "我注重纪念日、仪式感和爱情中的象征意义。", dimension: 'NS', direction: 1 },
  { id: 17, text: "我更看重伴侣现在的经济基础和生活能力，而不是画大饼。", dimension: 'NS', direction: -1 },
  { id: 18, text: "在这个快节奏的时代，我认为寻找“灵魂伴侣”是不切实际的。", dimension: 'NS', direction: -1 },
  { id: 19, text: "我经常和伴侣讨论抽象的概念、哲学问题或人类的未来。", dimension: 'NS', direction: 1 },
  { id: 20, text: "我喜欢按部就班的约会计划，不喜欢突如其来的变动。", dimension: 'NS', direction: -1 },
  { id: 21, text: "哪怕现状很艰难，只要我们有共同的愿景，我就有动力坚持下去。", dimension: 'NS', direction: 1 },
  { id: 22, text: "我很容易注意到伴侣穿衣打扮或生活习惯上的微小变化。", dimension: 'NS', direction: -1 },
  { id: 23, text: "对于我来说，一段关系的“氛围感”比“柴米油盐”更重要。", dimension: 'NS', direction: 1 },
  { id: 24, text: "我在做感情决策时，主要依据过往的经验和眼前的事实。", dimension: 'NS', direction: -1 },

  // --- Dimension 3: Feeling (F) vs Thinking (T) ---
  { id: 25, text: "当伴侣犯错时，只要态度诚恳，我很容易心软原谅。", dimension: 'FT', direction: 1 },
  { id: 26, text: "如果伴侣向我抱怨同事，我会首先帮TA分析谁对谁错，而不是通过骂同事来附和TA。", dimension: 'FT', direction: -1 },
  { id: 27, text: "我认为在争吵中保持逻辑清晰比表达情绪更重要。", dimension: 'FT', direction: -1 },
  { id: 28, text: "我很容易受到伴侣情绪的影响，TA难过我也会跟着难过。", dimension: 'FT', direction: 1 },
  { id: 29, text: "为了维护关系的和谐，我愿意说一些善意的谎言。", dimension: 'FT', direction: 1 },
  { id: 30, text: "即使我很爱对方，如果客观条件（如异地、规划不同）不合适，我会果断分手。", dimension: 'FT', direction: -1 },
  { id: 31, text: "我非常在意言语背后的情感色彩，哪怕一句话逻辑是对的，语气不好我也会生气。", dimension: 'FT', direction: 1 },
  { id: 32, text: "我认为通过制定规则和协议来管理亲密关系是很有效的方法。", dimension: 'FT', direction: -1 },
  { id: 33, text: "在做决定时，我会优先考虑这会给伴侣带来什么感受，而不是利益最大化。", dimension: 'FT', direction: 1 },
  { id: 34, text: "我不仅能察觉到伴侣的情绪，还能准确说出TA当下的感受。", dimension: 'FT', direction: 1 },
  { id: 35, text: "当我们在讨论问题时，我觉得伴侣过于情绪化会让我很累。", dimension: 'FT', direction: -1 },
  { id: 36, text: "在表达爱意时，我更倾向于直接解决问题，而不是甜言蜜语。", dimension: 'FT', direction: -1 },

  // --- Dimension 4: Anxious (A) vs Avoidant/Dismissive (D) ---
  { id: 37, text: "我经常担心伴侣不再爱我，或者会突然离开我。", dimension: 'AD', direction: 1 },
  { id: 38, text: "当伴侣试图在情感上过度依赖我时，我会本能地想要后退。", dimension: 'AD', direction: -1 },
  { id: 39, text: "如果伴侣几个小时不回消息，我会开始胡思乱想，感到焦虑。", dimension: 'AD', direction: 1 },
  { id: 40, text: "我很难完全信任另一个人并与其建立深度的依赖关系。", dimension: 'AD', direction: -1 },
  { id: 41, text: "我渴望与伴侣每时每刻都在一起，完全融合。", dimension: 'AD', direction: 1 },
  { id: 42, text: "我非常重视自己的独立性，不喜欢被关系束缚。", dimension: 'AD', direction: -1 },
  { id: 43, text: "我经常需要伴侣反复确认TA是爱我的。", dimension: 'AD', direction: 1 },
  { id: 44, text: "我不习惯在伴侣面前展示脆弱，这让我觉得不安全。", dimension: 'AD', direction: -1 },
  { id: 45, text: "为了维持关系，我倾向于讨好伴侣，甚至牺牲自己的需求。", dimension: 'AD', direction: 1 },
  { id: 46, text: "当发生冲突时，我的第一反应是冷处理，躲进自己的洞穴里。", dimension: 'AD', direction: -1 },
  { id: 47, text: "我对他人的情绪变化极其敏感，总觉得是不是自己做错了什么。", dimension: 'AD', direction: 1 },
  { id: 48, text: "我认为过度的亲密会让我失去自我。", dimension: 'AD', direction: -1 },
];