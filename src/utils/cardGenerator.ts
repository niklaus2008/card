import { CardData } from '@/types';

/**
 * 卡片主题枚举
 */
export enum CardTheme {
  CLASSIC = 'classic',
  SUNSET = 'sunset', 
  OCEAN = 'ocean',
  FOREST = 'forest',
  GALAXY = 'galaxy',
  AURORA = 'aurora',
  WHITE = 'white',
  BLACK = 'black',
  GRAY = 'gray'
}

/**
 * 主题颜色配置
 */
const THEME_COLORS = {
  [CardTheme.CLASSIC]: {
    gradient: [
      { stop: 0, color: '#667eea' },
      { stop: 1, color: '#764ba2' }
    ]
  },
  [CardTheme.SUNSET]: {
    gradient: [
      { stop: 0, color: '#ff9a9e' },
      { stop: 0.5, color: '#fecfef' },
      { stop: 1, color: '#fecfef' }
    ]
  },
  [CardTheme.OCEAN]: {
    gradient: [
      { stop: 0, color: '#667eea' },
      { stop: 1, color: '#764ba2' }
    ]
  },
  [CardTheme.FOREST]: {
    gradient: [
      { stop: 0, color: '#11998e' },
      { stop: 1, color: '#38ef7d' }
    ]
  },
  [CardTheme.GALAXY]: {
    gradient: [
      { stop: 0, color: '#2c3e50' },
      { stop: 1, color: '#4a00e0' }
    ]
  },
  [CardTheme.AURORA]: {
    gradient: [
      { stop: 0, color: '#00c6ff' },
      { stop: 1, color: '#0072ff' }
    ]
  },
  [CardTheme.WHITE]: {
    gradient: [
      { stop: 0, color: '#ffffff' },
      { stop: 1, color: '#ffffff' }
    ]
  },
  [CardTheme.BLACK]: {
    gradient: [
      { stop: 0, color: '#1a1a1a' },
      { stop: 1, color: '#1a1a1a' }
    ]
  },
  [CardTheme.GRAY]: {
    gradient: [
      { stop: 0, color: '#6b7280' },
      { stop: 1, color: '#6b7280' }
    ]
  }
};

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {string} format - 格式字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[date.getDay()];

  switch (format) {
    case 'd':
      return day.toString();
    case 'yyyy年M月':
      return `${year}年${month}月`;
    case 'EEEE':
      return weekday;
    case 'yyyy-MM-dd':
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    default:
      return date.toString();
  }
}

/**
 * 卡片生成工具类
 * @class CardGenerator
 */
export class CardGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('无法创建Canvas上下文');
    }
    this.ctx = context;
  }

  /**
   * 生成卡片图片
   * @param {CardData} cardData - 卡片数据
   * @param {CardTheme} theme - 卡片主题，默认为经典主题
   * @param {number} width - 卡片宽度，默认400
   * @param {number} height - 卡片高度，默认600
   * @returns {Promise<string>} Base64格式的图片数据
   */
  async generateCard(
    cardData: CardData, 
    theme: CardTheme = CardTheme.CLASSIC,
    width = 400, 
    height = 600
  ): Promise<string> {
    // 设置画布尺寸
    this.canvas.width = width;
    this.canvas.height = height;

    // 设置高DPI显示，提升图片质量
    const dpr = Math.max(window.devicePixelRatio || 1, 2); // 至少2倍分辨率
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.scale(dpr, dpr);

    // 开启抗锯齿
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // 绘制背景
    this.drawBackground(width, height, theme);

    // 绘制日期
    this.drawDate(cardData.date, width, height, theme);

    // 绘制金句
    this.drawQuote(cardData.content, width, height, theme);

    // 绘制署名
    this.drawSignature(cardData.source, width, height, theme);

    // 返回高质量PNG图片数据
    return this.canvas.toDataURL('image/png', 1.0);
  }

  /**
   * 绘制主题背景（完全匹配CSS效果）
   * @private
   */
  private drawBackground(width: number, height: number, theme: CardTheme): void {
    const themeConfig = THEME_COLORS[theme];
    
    // 创建渐变背景，匹配CSS linear-gradient(135deg, ...)
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    
    themeConfig.gradient.forEach(({ stop, color }) => {
      gradient.addColorStop(stop, color);
    });

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // 添加圆角效果（模拟CSS border-radius: 20px）
    this.ctx.save();
    this.roundRect(0, 0, width, height, 20);
    this.ctx.clip();
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();

    // 添加微妙的光影效果，增强视觉层次
    this.addLightingEffects(width, height);
  }

  /**
   * 添加光影效果
   * @private
   */
  private addLightingEffects(width: number, height: number): void {
    // 顶部高光
    const highlight = this.ctx.createLinearGradient(0, 0, 0, height * 0.3);
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    this.ctx.fillStyle = highlight;
    this.ctx.fillRect(0, 0, width, height * 0.3);

    // 底部阴影
    const shadow = this.ctx.createLinearGradient(0, height * 0.7, 0, height);
    shadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadow.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    
    this.ctx.fillStyle = shadow;
    this.ctx.fillRect(0, height * 0.7, width, height * 0.3);
  }

  /**
   * 创建圆角矩形路径
   * @private
   */
  private roundRect(x: number, y: number, width: number, height: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  /**
   * 获取主题对应的文字颜色
   * @private
   */
  private getTextColor(theme: CardTheme): string {
    const lightThemes = [CardTheme.WHITE];
    return lightThemes.includes(theme) ? '#1a1a1a' : '#ffffff';
  }

  /**
   * 获取主题对应的文字透明度颜色
   * @private
   */
  private getTextAlphaColor(theme: CardTheme, alpha: number): string {
    const lightThemes = [CardTheme.WHITE];
    const baseColor = lightThemes.includes(theme) ? '26, 26, 26' : '255, 255, 255';
    return `rgba(${baseColor}, ${alpha})`;
  }

  /**
   * 绘制日期（优化字体和样式）
   * @private
   */
  private drawDate(date: Date, width: number, height: number, theme: CardTheme): void {
    const day = formatDate(date, 'd');
    const yearMonth = formatDate(date, 'yyyy年M月');
    const weekday = formatDate(date, 'EEEE');

    // 设置字体抗锯齿
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // 绘制大号日期数字 - 增强视觉冲击力
    this.ctx.fillStyle = this.getTextColor(theme);
    this.ctx.font = 'bold 90px PingFang SC, Microsoft YaHei, SimHei, Arial, sans-serif';
    // 添加文字阴影效果
    const shadowColor = theme === CardTheme.WHITE ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowColor = shadowColor;
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    this.ctx.fillText(day, width / 2, height * 0.2);

    // 重置阴影
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;

    // 绘制年月 - 优化透明度和字重
    this.ctx.font = '26px PingFang SC, Microsoft YaHei, SimHei, Arial, sans-serif';
    this.ctx.fillStyle = this.getTextAlphaColor(theme, 0.9);
    this.ctx.fillText(yearMonth, width / 2, height * 0.315);

    // 绘制星期 - 保持一致的视觉层次
    this.ctx.font = '20px PingFang SC, Microsoft YaHei, SimHei, Arial, sans-serif';
    this.ctx.fillStyle = this.getTextAlphaColor(theme, 0.8);
    this.ctx.fillText(weekday, width / 2, height * 0.375);
  }

  /**
   * 绘制金句（优化排版和字体）
   * @private
   */
  private drawQuote(content: string, width: number, height: number, theme: CardTheme): void {
    this.ctx.fillStyle = this.getTextColor(theme);
    this.ctx.font = '32px PingFang SC, Microsoft YaHei, SimHei, Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // 添加微妙的文字阴影
    const shadowColor = theme === CardTheme.WHITE ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.2)';
    this.ctx.shadowColor = shadowColor;
    this.ctx.shadowBlur = 2;
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;

    // 文字换行处理 - 优化行间距
    const maxWidth = width * 0.85;
    const lines = this.wrapText(content, maxWidth);
    const lineHeight = 45;
    const startY = height * 0.55 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, index) => {
      this.ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    // 重置阴影
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  /**
   * 绘制署名（优化样式）
   * @private
   */
  private drawSignature(source: string, width: number, height: number, theme: CardTheme): void {
    this.ctx.fillStyle = this.getTextAlphaColor(theme, 0.85);
    this.ctx.font = '20px PingFang SC, Microsoft YaHei, SimHei, Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // 添加轻微的文字阴影
    const shadowColor = theme === CardTheme.WHITE ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.15)';
    this.ctx.shadowColor = shadowColor;
    this.ctx.shadowBlur = 1;
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    
    this.ctx.fillText(source, width / 2, height * 0.85);
    
    // 重置阴影
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  /**
   * 智能文字换行处理（优化中文排版）
   * @private
   */
  private wrapText(text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    let line = '';

    // 按标点符号和空格分割，更好地处理中文排版
    const words = text.split(/([，。；：！？、\s]+)/);
    
    for (const word of words) {
      const testLine = line + word;
      const metrics = this.ctx.measureText(testLine);

      if (metrics.width > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line.trim() !== '') {
      lines.push(line.trim());
    }

    // 如果还是太长，按字符分割
    if (lines.some(line => this.ctx.measureText(line).width > maxWidth)) {
      return this.wrapTextByCharacter(text, maxWidth);
    }

    return lines;
  }

  /**
   * 按字符换行（备用方案）
   * @private
   */
  private wrapTextByCharacter(text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    let line = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const testLine = line + char;
      const metrics = this.ctx.measureText(testLine);

      if (metrics.width > maxWidth && line !== '') {
        lines.push(line);
        line = char;
      } else {
        line = testLine;
      }
    }

    if (line !== '') {
      lines.push(line);
    }

    return lines;
  }

  /**
   * 下载卡片图片
   * @param {string} dataUrl - Base64图片数据
   * @param {string} filename - 文件名，默认为当前时间戳
   */
  static downloadImage(dataUrl: string, filename?: string): void {
    const link = document.createElement('a');
    link.download = filename || `card-${Date.now()}.png`;
    link.href = dataUrl;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * 获取格式化的日期字符串（用于文件名）
   * @param {Date} date - 日期对象
   * @returns {string} 格式化的日期字符串
   */
  static getFormattedDateString(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd');
  }
}

/**
 * 单例实例
 */
export const cardGenerator = new CardGenerator(); 