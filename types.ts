export type DimensionType = 'EI' | 'NS' | 'FT' | 'AD'; // The 4 axes
export type DimensionValue = 'E' | 'I' | 'N' | 'S' | 'F' | 'T' | 'A' | 'D';
export type CategoryKey = 'NT' | 'NF' | 'ST' | 'SF';
export type Gender = 'male' | 'female';
export type ArtStyleKey = 'anime' | 'manhwa' | 'gufeng' | 'hongkong';

export interface Question {
  id: number;
  text: string;
  dimension: DimensionType;
  direction: 1 | -1; // 1 means 'Agree' maps to the first letter (E, N, F, A), -1 maps to the second (I, S, T, D)
}

export interface PersonalityProfile {
  code: string; // e.g., "ENFA"
  name: string; // e.g., "热情浪漫主义者"
  nickname: string; // e.g., "黏人小狗"
  tags: string[]; // e.g., ["情绪雷达", "纯爱战神", "粘人精"]
  category: CategoryKey;
  icon: string; // Key for the Lucide icon
  definition: string; // Short summary
  // Structured detailed analysis
  structure: string;   // 【深度人格结构】
  behavior: string;    // 【恋爱行为模式】
  strengths: string;   // 【优势特质】
  blindSpots: string;  // 【恋爱盲点】
  partners: string;    // 【适合的伴侣类型】
  advice: string;      // 【相处建议】
}

export type PersonalityMap = Record<string, PersonalityProfile>;

export interface GeneratedMedia {
  imageUrl: string | null;
  videoUrl: string | null;
  imageBase64: string | null;
}