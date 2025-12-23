/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const MAX_STORY_PAGES = 10;
export const BACK_COVER_PAGE = 11;
export const TOTAL_PAGES = 11;
export const INITIAL_PAGES = 2;
export const GATE_PAGE = 2;
export const BATCH_SIZE = 6;
export const DECISION_PAGES = [3];

export const GENRES = ["英雄联盟原画", "经典恐怖", "超级英雄", "黑暗科幻", "高魔奇幻", "霓虹侦探", "废土末日", "轻松喜剧", "青春校园", "自定义"];

export interface StylePreset {
  baseStyle: string;               // 基础风格描述
  texture: string;                 // 材质关键词
  lighting: string;                // 光影关键词
  composition: string;             // 构图关键词
  negative?: string;               // 负面提示词
  characterConsistency?: string;   // 角色一致性增强词
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  "英雄联盟原画": {
    baseStyle: "(Epic fantasy graphic novel style:1.5), (League of Legends splash art aesthetic:1.3), highly detailed digital painting, masterful brushwork",
    texture: "Rich impasto textures, oil painting texture, no-lineart rendering, thick painted borders",
    lighting: "Cinematic lighting, dramatic illumination, strong chiaroscuro, (rim lighting from magical energy:1.2), volumetric lighting, magical glow",
    composition: "Dynamic composition, wide-angle lens, (dramatic high-tension perspective:1.2), epic battle scene scales",
    negative: "simple lineart, flat colors, anime cel-shading, thin outlines, sketch, blurry, watermark",
    characterConsistency: "Maintain exact character likeness from reference, same facial structure and proportions"
  },
  "default": {
    baseStyle: "comic book art, detailed ink, vibrant colors",
    texture: "clean ink lines, professional comic coloring",
    lighting: "vibrant lighting, high contrast",
    composition: "standard comic panel layout",
    negative: "blurry, low quality, watermark"
  }
};
export const TONES = [
    "动作大戏 (简短有力的对话，侧重动作感)",
    "内心独白 (大量的旁白揭示角色内心想法)",
    "俏皮幽默 (角色用幽默作为防御机制)",
    "歌剧风格 (宏大戏剧性的宣言和高风险感)",
    "随性日常 (自然对话，侧重人际关系和八卦)",
    "温馨治愈 (温暖、柔和、乐观)"
];

export const LANGUAGES = [
    { code: 'zh-CN', name: '中文 (简体)' },
    { code: 'en-US', name: '英语 (美国)' },
    { code: 'ja-JP', name: '日语 (日本)' },
    { code: 'ko-KR', name: '韩语 (韩国)' },
    { code: 'fr-FR', name: '法语 (法国)' },
    { code: 'de-DE', name: '德语 (德国)' },
    { code: 'es-MX', name: '西班牙语 (墨西哥)' },
    { code: 'it-IT', name: '意大利语 (意大利)' },
    { code: 'ru-RU', name: '俄语 (俄罗斯)' }
];

export interface ComicFace {
  id: string;
  type: 'cover' | 'story' | 'back_cover';
  imageUrl?: string;
  narrative?: Beat;
  choices: string[];
  resolvedChoice?: string;
  isLoading: boolean;
  pageIndex?: number;
  isDecisionPage?: boolean;
}

export interface Beat {
  caption?: string;
  dialogue?: string;
  scene: string;
  choices: string[];
  focus_char: 'hero' | 'friend' | 'other';
}

export interface Persona {
  base64: string;
  desc: string;
}