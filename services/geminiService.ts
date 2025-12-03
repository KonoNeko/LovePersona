import { GoogleGenAI } from "@google/genai";
import { PersonalityProfile, Gender } from "../types";

/**
 * Initializes the Gemini API client.
 */
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to get a random element from an array
const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// Detailed Visual Mapping for each of the 16 Love Personas
const VISUAL_MAP: Record<string, string> = {
  // --- NF Group ---
  ENFA: "Theme: 'Sticky Puppy'. Visuals: Wearing a fluffy oversized hoodie with cute puppy ears on the hood. Warm, energetic expression. Holding a heart-shaped cushion or surrounded by floating hearts. Soft pink and cream colors.",
  ENFD: "Theme: 'Social Butterfly'. Visuals: Elegant yet playful outfit with floral patterns. Surrounded by glowing, translucent holographic butterflies. Dreamy and charming smile. Flowy hair accessories.",
  INFA: "Theme: 'Devoted Poet'. Visuals: Holding an old-fashioned quill or a vintage diary. Wearing a soft, knitted scarf and artist beret. Melancholic yet gentle eyes. Floating feathers in the background.",
  INFD: "Theme: 'Mysterious Moon'. Visuals: Wearing a starry-patterned veil or cloak. Sitting on a crescent moon or surrounded by moonlight glow. Mysterious, reserved expression. Silver and midnight blue accents.",
  
  // --- NT Group ---
  ENTA: "Theme: 'Mastermind Planner'. Visuals: Holding a holographic tablet or blueprint scroll. Wearing smart, stylish glasses and a structured trench coat. Calculating, confident smirk. Floating chess pieces nearby.",
  ENTD: "Theme: 'Love Player/Gamer'. Visuals: Cyberpunk-lite casual streetwear. Holding a stylized game controller or surrounded by pixel-art hearts. Confident, mischievous grin. Neon purple and electric blue accents.",
  INTA: "Theme: 'The Strategist'. Visuals: Holding a long scroll of analysis. Wearing a minimalist high-collar coat. Intense, observant gaze through rimless glasses. Background has faint mathematical formulas.",
  INTD: "Theme: 'Iceberg Scholar'. Visuals: Wearing a pristine white turtleneck and a lab coat or blazer. Surrounded by floating ice crystals or snowflakes. Cool, detached, intellectual expression. Icy blue and white palette.",

  // --- ST Group ---
  ESTA: "Theme: 'Protective Lion'. Visuals: Regal posture, wearing a jacket with fur trim (resembling a lion's mane). Holding a stylized shield. Fierce, protective, possessive gaze. Gold and royal blue accents.",
  ESTD: "Theme: 'Iron Executor'. Visuals: Wearing a sharp, perfectly tailored suit or work uniform with rolled-up sleeves. Holding a hammer or wrench tool symbol. Stoic, serious, reliable expression. Metallic grey and steel blue colors.",
  ISTA: "Theme: 'Loyal Knight'. Visuals: Wearing modern stylized light armor or a heavy cape. Holding a sword (symbolic of protection) planted on the ground. Loyal, determined, steady gaze. Silver and navy blue.",
  ISTD: "Theme: 'Independent Worker'. Visuals: Minimalist, functional fashion. Carrying a briefcase or looking at a wristwatch. Calm, distant, professional expression. Clean lines, monochromatic palette.",

  // --- SF Group ---
  ESFA: "Theme: 'Little Sun'. Visuals: Radiating sunlight, glowing aura. Wearing bright, summer-style clothing (sunflower patterns). Big, blindingly cheerful smile. Open arms. Golden yellow and orange colors.",
  ESFD: "Theme: 'The Breeze'. Visuals: Wind-blown hair, very casual and loose clothing. Surrounded by swirling leaves or wind effects. Relaxed, carefree laughing expression. Mint green and sky blue.",
  ISFA: "Theme: 'Soft Sheep'. Visuals: Wearing a very thick, white woolly sweater or wrapped in a cozy blanket. Surrounded by soft white clouds. Shy, blushing, gentle expression. Pastel white and baby blue.",
  ISFD: "Theme: 'Coffee/Life'. Visuals: Holding a steaming cup of coffee or tea. Sitting in a cozy beanbag or cafe setting. Relaxed, zen, peaceful expression. Earth tones, latte art colors."
};

/**
 * Generates an avatar with the specific "Macaron Cel-Shaded Anime" aesthetic.
 * Incorporates specific visual traits based on the user's personality nickname.
 */
export const generateAvatar = async (profile: PersonalityProfile, gender: Gender): Promise<string> => {
  const ai = getAiClient();
  
  const genderTerm = gender === 'male' ? 'anime boy, handsome, young man' : 'anime girl, beautiful, young woman';
  
  // 1. Get Base Visual Traits from Map
  const specificVisuals = VISUAL_MAP[profile.code] || `Theme: ${profile.nickname}. Visuals: Stylish anime fashion matching the vibe of ${profile.name}.`;

  // 2. Add Randomness (Pose)
  const dynamicPoses = [
    "looking at camera with a characteristic expression",
    "slight side profile, dynamic angle",
    "candid shot, mid-motion",
    "adjusting accessories/hair",
    "sitting comfortably",
    "standing confidently with wind effects"
  ];
  const randomPose = getRandomElement(dynamicPoses);

  // 3. Construct the Prompt with Personality Analysis
  // We inject tags and definition to help the model understand the "Vibe" (facial expression, lighting mood)
  const prompt = `
  **TASK:** Create a Character Illustration of a ${genderTerm}.
  
  **CHARACTER PROFILE (The "Vibe"):**
  - **Archetype:** ${profile.nickname} (Code: ${profile.code})
  - **Personality Tags:** ${profile.tags.join(", ")}
  - **Core Trait:** ${profile.definition}
  - **Hidden Vibe:** ${profile.structure} (Use this to determine facial expression and atmosphere).

  **VISUAL SPECIFICATIONS (Strict):**
  - **Specific Elements:** ${specificVisuals}
  - **Pose:** ${randomPose}.
  - **Art Style:** **Modern Macaron Anime**. High-key lighting, bright, airy, pastel colors. Cel-shaded or semi-realistic anime style.
  - **Color Palette:** Soft Pastels (Macaron Pink, Baby Blue, Mint, Lavender, Cream) mixed with the character's theme colors. NO dark/muddy backgrounds.
  - **Background:** Abstract, soft gradient, or simple elements (hearts, stars, clouds) matching the theme. High brightness.

  **FORMAT:**
  - Aspect Ratio: 9:16 (Portrait).
  - Center subject.
  - No text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: "9:16",
        }
      }
    });

    let base64String = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64String = part.inlineData.data;
        break; 
      }
    }

    if (!base64String) {
      throw new Error("No image data returned from Gemini.");
    }

    return `data:image/png;base64,${base64String}`;

  } catch (error) {
    console.error("Error generating avatar:", error);
    throw error;
  }
};