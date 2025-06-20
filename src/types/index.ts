/**
 * 卡片数据接口
 * @interface CardData
 */
export interface CardData {
  /** 金句内容 */
  content: string;
  /** 来源/署名 */
  source: string;
  /** 日期 */
  date: Date;
}

/**
 * 卡片视觉主题枚举（用于下载图片的主题样式）
 * @enum CardVisualTheme
 */
export enum CardVisualTheme {
  CLASSIC = 'classic',   // 经典紫色渐变
  SUNSET = 'sunset',     // 日落粉色渐变
  OCEAN = 'ocean',       // 海洋蓝色渐变
  FOREST = 'forest',     // 森林绿色渐变
  GALAXY = 'galaxy',     // 银河深色渐变
  AURORA = 'aurora',     // 极光蓝色渐变
  WHITE = 'white',       // 纯白简约
  BLACK = 'black',       // 纯黑简约
  GRAY = 'gray'          // 雅灰简约
}

/**
 * 卡片内容主题枚举（用于AI生成金句的主题分类）
 * @enum CardTheme
 */
export enum CardTheme {
  INSPIRATIONAL = 'inspirational', // 励志
  PHILOSOPHICAL = 'philosophical', // 哲理
  EMOTIONAL = 'emotional', // 情感
  LIFE = 'life', // 生活
  WISDOM = 'wisdom', // 智慧
}

/**
 * 硅基流动API响应接口
 * @interface SiliconFlowResponse
 */
export interface SiliconFlowResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created: number;
  model: string;
  object: string;
}

/**
 * 硅基流动API请求参数接口
 * @interface SiliconFlowRequest
 */
export interface SiliconFlowRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * 应用状态接口
 * @interface AppState
 */
export interface AppState {
  /** 当前卡片数据 */
  cardData: CardData;
  /** 当前视觉主题 */
  visualTheme: CardVisualTheme;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 是否显示AI生成选项 */
  showAIOptions: boolean;
} 