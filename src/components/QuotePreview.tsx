import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

/**
 * 卡片尺寸选项
 */
type CardSize = 'small' | 'medium' | 'large';

/**
 * 卡片主题选项
 */
type CardTheme = 'classic' | 'sunset' | 'ocean' | 'forest' | 'galaxy' | 'aurora';

interface QuotePreviewProps {
  quote: string;
  author: string;
}

/**
 * 金句预览组件
 * 支持多种主题和智能尺寸选择，具备智能字体适配功能
 * @param quote - 金句内容
 * @param author - 作者信息
 */
const QuotePreview: React.FC<QuotePreviewProps> = ({ quote, author }) => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('classic');
  const [selectedSize, setSelectedSize] = useState<CardSize>('medium');
  const [isThemeExpanded, setIsThemeExpanded] = useState<boolean>(false);

  /**
   * 根据文本长度自动选择卡片尺寸
   * @param text - 文本内容
   * @returns 推荐的卡片尺寸
   */
  const getAutoSize = (text: string): CardSize => {
    const length = text.length;
    
    if (length <= 30) {
      return 'small'; // 短文本：小卡片，突出显示
    } else if (length <= 80) {
      return 'medium'; // 中等文本：中卡片，平衡美观
    } else {
      return 'large'; // 长文本：大卡片，确保完整显示
    }
  };

  /**
   * 监听金句变化，自动调整卡片尺寸
   */
  useEffect(() => {
    const autoSize = getAutoSize(quote);
    setSelectedSize(autoSize);
  }, [quote]);

  /**
   * 根据文字长度计算动态字体样式类
   * 基于美学原理：短文本用大字体突出视觉冲击，长文本用小字体保证可读性
   * @param text - 文本内容
   * @returns 字体样式类名
   */
  const getDynamicTextClass = (text: string): string => {
    const length = text.length;
    
    if (length <= 30) {
      return 'text-dynamic-small'; // 短文本：大字体
    } else if (length <= 80) {
      return 'text-dynamic-medium'; // 中等文本：中等字体
    } else {
      return 'text-dynamic-large'; // 长文本：小字体
    }
  };

  /**
   * 获取作者文字的动态样式类
   * @param text - 文本内容
   * @returns 作者样式类名
   */
  const getDynamicAuthorClass = (text: string): string => {
    const length = text.length;
    
    if (length <= 30) {
      return 'author-dynamic-small';
    } else if (length <= 80) {
      return 'author-dynamic-medium';
    } else {
      return 'author-dynamic-large';
    }
  };

  /**
   * 获取日期文字的动态样式类
   * @param text - 文本内容
   * @returns 日期样式类名
   */
  const getDynamicDateClass = (text: string): string => {
    const length = text.length;
    
    if (length <= 30) {
      return 'date-dynamic-small';
    } else if (length <= 80) {
      return 'date-dynamic-medium';
    } else {
      return 'date-dynamic-large';
    }
  };

  /**
   * 主题配置
   */
  const themes = [
    { key: 'classic', name: '🌈 经典渐变', desc: '多彩渐变，充满活力' },
    { key: 'sunset', name: '🌅 夕阳西下', desc: '温暖的粉色调' },
    { key: 'ocean', name: '🌊 深海蓝调', desc: '优雅的蓝紫色' },
    { key: 'forest', name: '🌲 森林绿意', desc: '自然的绿色调' },
    { key: 'galaxy', name: '🌌 星河璀璨', desc: '神秘的深色调' },
    { key: 'aurora', name: '❄️ 极光蓝', desc: '清新的蓝色调' }
  ];

  /**
   * 获取当前选中主题的信息
   */
  const getCurrentTheme = () => {
    return themes.find(theme => theme.key === selectedTheme) || themes[0];
  };

  /**
   * 切换主题展开/收起状态
   */
  const toggleThemeExpanded = () => {
    setIsThemeExpanded(!isThemeExpanded);
  };

  /**
   * 选择主题并收起面板
   */
  const selectTheme = (themeKey: string) => {
    setSelectedTheme(themeKey as CardTheme);
    setIsThemeExpanded(false);
  };

  /**
   * 获取当前日期信息
   */
  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    return {
      day,
      fullDate: `${year}.${month}.${dayStr}`,
      weekday
    };
  };

  const dateInfo = getCurrentDate();

  /**
   * 下载卡片功能
   * 直接克隆预览DOM元素，确保100%一致性
   */
  const downloadCard = async () => {
    const originalElement = document.getElementById('quote-card');
    if (!originalElement) return;

    try {
      // 获取原始元素的尺寸
      const rect = originalElement.getBoundingClientRect();
      
      // 创建更大的容器，确保光晕边框完全显示
      const shadowSize = 80;
      const canvasContainer = document.createElement('div');
      canvasContainer.style.cssText = `
        width: ${rect.width + shadowSize * 2}px;
        height: ${rect.height + shadowSize * 2}px;
        background: transparent;
        position: absolute;
        top: -9999px;
        left: -9999px;
        padding: ${shadowSize}px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // 创建卡片容器 - 复制预览的完整结构
      const cardContainer = document.createElement('div');
      cardContainer.className = 'relative';
      cardContainer.style.cssText = `
        position: relative;
        display: inline-block;
      `;

      // 深度克隆原始卡片元素
      const clonedCard = originalElement.cloneNode(true) as HTMLElement;
      clonedCard.style.cssText = `
        width: ${rect.width}px;
        height: ${rect.height}px;
        position: relative;
        display: block;
        margin: 0;
        transform: translateY(-5px) scale(1.02);
        box-shadow: 
          0 20px 40px rgba(0, 0, 0, 0.3),
          0 30px 60px rgba(0, 0, 0, 0.2),
          0 10px 30px rgba(0, 0, 0, 0.1);
      `;

      // 确保光晕边框效果 - 重新创建完整的光晕效果
      const glowElement = clonedCard.querySelector('.absolute.-inset-1');
      if (glowElement) {
        // 移除原有的光晕元素
        glowElement.remove();
      }

      // 创建新的增强光晕边框
      const enhancedGlow = document.createElement('div');
      enhancedGlow.style.cssText = `
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080, #ff0080);
        background-size: 400% 400%;
        border-radius: 24px;
        opacity: 0.4;
        filter: blur(6px);
        z-index: -1;
      `;
      clonedCard.appendChild(enhancedGlow);

      // 添加额外的外层光晕
      const outerGlow = document.createElement('div');
      outerGlow.style.cssText = `
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080);
        border-radius: 28px;
        opacity: 0.2;
        filter: blur(12px);
        z-index: -2;
      `;
      clonedCard.appendChild(outerGlow);

      // 递归处理所有子元素，确保样式完整
      const copyStyles = (source: Element, target: Element) => {
        const sourceStyle = window.getComputedStyle(source);
        const targetElement = target as HTMLElement;
        
        // 复制所有计算样式
        Array.from(sourceStyle).forEach(property => {
          try {
            targetElement.style.setProperty(
              property,
              sourceStyle.getPropertyValue(property),
              sourceStyle.getPropertyPriority(property)
            );
          } catch (e) {
            // 忽略无法设置的属性
          }
        });
        
        // 移除可能干扰html2canvas的属性
        targetElement.style.animation = 'none';
        targetElement.style.transition = 'none';
        
        // 递归处理子元素
        for (let i = 0; i < source.children.length; i++) {
          if (target.children[i]) {
            copyStyles(source.children[i], target.children[i]);
          }
        }
      };

      // 应用样式复制
      copyStyles(originalElement, clonedCard);

      // 组装元素
      cardContainer.appendChild(clonedCard);
      canvasContainer.appendChild(cardContainer);
      document.body.appendChild(canvasContainer);

      // 等待样式应用和渲染
      await new Promise(resolve => setTimeout(resolve, 300));

      // 使用html2canvas渲染整个容器
      const canvas = await html2canvas(canvasContainer, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
        width: rect.width + shadowSize * 2,
        height: rect.height + shadowSize * 2,
        imageTimeout: 0,
        removeContainer: false,
        ignoreElements: (element) => {
          return element.tagName === 'SCRIPT' || 
                 element.tagName === 'STYLE';
        }
      });

      // 清理临时元素
      document.body.removeChild(canvasContainer);

      // 下载图片
      const link = document.createElement('a');
      link.download = `金句卡片-${getCurrentTheme().name.replace(/[🌈🌅🌊🌲🌌❄️]/g, '').trim()}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };



  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* 卡片设置标题 */}
      <div className="label-enhanced">
        🎨 卡片预览
      </div>

      
     

      {/* 卡片预览 */}
      <div className="relative">
        <div
          id="quote-card"
          className={`card-preview card-theme-${selectedTheme} ${`card-size-${selectedSize}`} card-content-adaptive`}
        >
          {/* 装饰光晕边框 */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500 rounded-3xl opacity-30 blur-sm animate-pulse"></div>
          
          {/* 卡片内容 */}
          <div className="relative h-full flex flex-col justify-between items-center text-center p-8">
            {/* 日期部分 */}
            <div className="flex-shrink-0">
              <div className={`text-6xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent ${getDynamicDateClass(quote)}`}>
                {dateInfo.day}
              </div>
              <div className={`text-lg font-medium mb-1 ${getDynamicDateClass(quote)}`}>
                {dateInfo.fullDate}
              </div>
              <div className={`text-base opacity-80 ${getDynamicDateClass(quote)}`}>
                {dateInfo.weekday}
              </div>
            </div>

            {/* 内容部分 - 优化布局，确保文字完整显示 */}
            <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0 px-2">
              {/* 装饰引号 */}
              <div className="text-6xl opacity-20 mb-4">"</div>
              
              {/* 金句文本 - 移除严格的行数限制 */}
              <div className={`font-bold leading-relaxed mb-6 w-full ${getDynamicTextClass(quote)}`}
                   style={{
                     wordWrap: 'break-word',
                     wordBreak: 'break-word',
                     hyphens: 'auto',
                     maxHeight: 'none'
                   }}>
                {quote || '请输入您的金句...'}
              </div>
              
              {/* 作者信息 */}
              {author && (
                <div className="flex-shrink-0 w-full">
                  <div className="w-12 h-0.5 bg-white/60 mx-auto mb-3"></div>
                  <div className={`font-medium opacity-90 ${getDynamicAuthorClass(quote)}`}>
                    —— {author}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作区域 */}
      <div className="flex items-center gap-4">
        {/* 下载按钮 */}
        <Button
          onClick={downloadCard}
          className="btn-primary-enhanced btn-text-enhanced px-8 py-3 text-lg"
        >
          🖼️ 下载卡片
        </Button>

        {/* 主题选择器 */}
        <div className="relative">
          {/* 主题按钮 */}
          <Button
            onClick={toggleThemeExpanded}
            className={`btn-primary-enhanced btn-text-enhanced px-6 py-3 text-base transition-all duration-300 ${
              isThemeExpanded ? 'bg-white/25 border-white/50' : ''
            }`}
          >
            🎨 {getCurrentTheme().name}
            <span className={`ml-2 transition-transform duration-300 ${isThemeExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </Button>

          {/* 主题展开面板 */}
          <div className={`absolute bottom-full right-0 mb-2 w-80 transition-all duration-300 origin-bottom-right ${
            isThemeExpanded 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }`}>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/25 shadow-lg">
              <div className="text-white-enhanced font-semibold mb-3 text-sm">
                🎨 选择卡片主题
              </div>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <div
                    key={theme.key}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedTheme === theme.key
                        ? 'border-purple-400 bg-white/25 shadow-md'
                        : 'border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30'
                    }`}
                    onClick={() => selectTheme(theme.key)}
                  >
                    <div className="text-white-enhanced font-semibold text-sm mb-1">
                      {theme.name}
                    </div>
                    <div className="text-white-enhanced text-xs opacity-75">
                      {theme.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview; 