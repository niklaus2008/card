import React, { useState } from 'react';
import { CardVisualTheme } from '@/types';

/**
 * 主题配置对象
 */
const THEME_CONFIG = {
  [CardVisualTheme.CLASSIC]: {
    name: '经典紫',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '经典紫色渐变，优雅内敛'
  },
  [CardVisualTheme.SUNSET]: {
    name: '日落粉',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    description: '温暖粉色渐变，浪漫温馨'
  },
  [CardVisualTheme.OCEAN]: {
    name: '海洋蓝',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '深邃蓝色渐变，宁静致远'
  },
  [CardVisualTheme.FOREST]: {
    name: '森林绿',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    description: '自然绿色渐变，生机盎然'
  },
  [CardVisualTheme.GALAXY]: {
    name: '银河灰',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #4a00e0 100%)',
    description: '神秘深色渐变，星河璀璨'
  },
  [CardVisualTheme.AURORA]: {
    name: '极光蓝',
    gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    description: '清新蓝色渐变，如极光绚烂'
  },
  [CardVisualTheme.WHITE]: {
    name: '纯白简约',
    gradient: '#ffffff',
    description: '纯净白色，简约优雅'
  },
  [CardVisualTheme.BLACK]: {
    name: '纯黑简约',
    gradient: '#1a1a1a',
    description: '深邃黑色，现代时尚'
  },
  [CardVisualTheme.GRAY]: {
    name: '雅灰简约',
    gradient: '#6b7280',
    description: '温和灰色，沉稳内敛'
  }
};

/**
 * 主题选择器组件的Props接口
 * @interface ThemeSelectorProps
 */
interface ThemeSelectorProps {
  /** 当前选中的主题 */
  selectedTheme: CardVisualTheme;
  /** 主题变化的回调函数 */
  onThemeChange: (theme: CardVisualTheme) => void;
}

/**
 * 主题选择器组件
 * 提供主题选择功能，支持展开收起
 * @param {ThemeSelectorProps} props - 组件属性
 * @returns {JSX.Element} 主题选择器组件
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * 切换展开状态
   */
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  /**
   * 处理主题选择
   */
  const handleThemeSelect = (theme: CardVisualTheme) => {
    onThemeChange(theme);
    setIsExpanded(false); // 选择后自动收起
  };

  return (
    <div className="glass-effect p-3 rounded-2xl">
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between text-white font-semibold mb-2 hover:text-white/90 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>🎨</span>
          <span className="text-white/90 text-sm font-medium">选择主题风格</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {THEME_CONFIG[selectedTheme].name}
          </span>
        </div>
        <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 animate-fade-in">
          {Object.entries(THEME_CONFIG).map(([themeKey, config]) => {
            const theme = themeKey as CardVisualTheme;
            const isActive = theme === selectedTheme;
            const isLightTheme = theme === CardVisualTheme.WHITE;
            const textColor = isLightTheme ? 'text-gray-800' : 'text-white';
            const textOpacity = isLightTheme ? 'text-gray-600' : 'text-white/80';
            
            return (
              <button
                key={theme}
                onClick={() => handleThemeSelect(theme)}
                className={`relative p-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'ring-2 ring-white/50 scale-105 shadow-lg' 
                    : 'hover:scale-102 hover:shadow-md'
                }`}
                style={{
                  background: config.gradient,
                  minHeight: '60px'
                }}
                title={config.description}
              >
                <div className={`${textColor} font-medium text-xs mb-1`}>
                  {config.name}
                </div>
                <div className={`${textOpacity} text-xs`}>
                  {isActive && '✓ 已选择'}
                </div>
              </button>
            );
          })}
        </div>
      )}
      
      {isExpanded && (
        <p className="text-white/70 text-xs text-center mt-2">
          选择主题后，预览和下载的卡片将使用相同的视觉效果
        </p>
      )}
    </div>
  );
}; 