import React, { useEffect, useRef } from 'react';
import { CardData, CardVisualTheme } from '@/types';

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
 * 格式化预览日期
 * @param {Date} date - 日期对象
 * @returns {{day: string, yearMonth: string, weekday: string}} 格式化后的日期信息
 */
const formatDateForPreview = (date: Date) => {
  const day = date.getDate().toString();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const yearMonth = `${year}.${month}`;
  
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[date.getDay()];
  
  return { day, yearMonth, weekday };
};

/**
 * 卡片预览组件的Props接口
 * @interface CardPreviewProps
 */
interface CardPreviewProps {
  /** 卡片数据 */
  cardData: CardData;
  /** 当前视觉主题 */
  visualTheme: CardVisualTheme;
  /** 生成的图片URL */
  generatedImageUrl: string | null;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 生成卡片的回调函数 */
  onGenerateCard: () => void;
  /** 下载卡片的回调函数 */
  onDownloadCard: (imageUrl?: string, filename?: string) => void;
}

/**
 * 卡片预览组件
 * 显示卡片的实时预览和下载功能
 * @param {CardPreviewProps} props - 组件属性
 * @returns {JSX.Element} 卡片预览组件
 */
export const CardPreview: React.FC<CardPreviewProps> = ({
  cardData,
  visualTheme,
  generatedImageUrl,
  isLoading,
  onGenerateCard,
  onDownloadCard
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { day, yearMonth, weekday } = formatDateForPreview(cardData.date);

  const currentThemeConfig = THEME_CONFIG[visualTheme];

  /**
   * 获取主题对应的文字颜色
   */
  const getTextColor = () => {
    const lightThemes = [CardVisualTheme.WHITE];
    return lightThemes.includes(visualTheme) ? '#1a1a1a' : 'white';
  };

  /**
   * 获取主题对应的文字阴影
   */
  const getTextShadow = () => {
    const lightThemes = [CardVisualTheme.WHITE];
    return lightThemes.includes(visualTheme) 
      ? '1px 1px 2px rgba(0, 0, 0, 0.1)' 
      : '2px 2px 4px rgba(0, 0, 0, 0.3)';
  };

  const textColor = getTextColor();
  const textShadow = getTextShadow();

  /**
   * 处理生成按钮点击
   */
  const handleGenerate = () => {
    onGenerateCard();
  };

  /**
   * 处理下载按钮点击
   */
  const handleDownload = () => {
    if (generatedImageUrl) {
      const filename = `card-${cardData.date.getFullYear()}-${(cardData.date.getMonth() + 1)
        .toString().padStart(2, '0')}-${cardData.date.getDate().toString().padStart(2, '0')}-${visualTheme}`;
      onDownloadCard(generatedImageUrl, filename);
    }
  };

  /**
   * 当卡片数据更新时，自动滚动到预览区域
   */
  useEffect(() => {
    if (previewRef.current && generatedImageUrl) {
      previewRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [generatedImageUrl]);

  return (
    <div className="space-y-4" ref={previewRef}>
      {/* 预览标题 */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">
          卡片预览
        </h2>
        {generatedImageUrl && (
          <p className="text-white/80 text-sm">
            生成完成，可以下载了
          </p>
        )}
      </div>

      {/* 卡片预览区域 */}
      <div className="card-container animate-slide-up">
        <div 
          className="card-preview"
          style={{
            background: currentThemeConfig.gradient,
            borderRadius: '20px',
            padding: '30px',
            color: textColor,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '320px',
            height: '480px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* 日期部分 */}
          <div className="text-center" style={{ marginTop: '20px' }}>
            <div 
              className="card-date"
              style={{
                fontSize: '70px',
                fontWeight: 'bold',
                lineHeight: '1',
                textShadow: textShadow,
                marginBottom: '8px'
              }}
            >
              {day}
            </div>
            <div className="card-meta">
              <div style={{
                fontSize: '22px',
                color: visualTheme === CardVisualTheme.WHITE ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                marginBottom: '4px'
              }}>
                {yearMonth}
              </div>
              <div style={{
                fontSize: '16px',
                color: visualTheme === CardVisualTheme.WHITE ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)'
              }}>
                {weekday}
              </div>
            </div>
          </div>

          {/* 金句内容 */}
          <div 
            className="card-content"
            style={{
              fontSize: '22px',
              textAlign: 'center',
              textShadow: textShadow,
              lineHeight: '1.3',
              padding: '0 20px',
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%',
              wordWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {cardData.content || '在此输入您的金句...'}
          </div>

          {/* 来源署名 */}
          <div 
            className="card-source"
            style={{
              fontSize: '16px',
              textAlign: 'center',
              color: visualTheme === CardVisualTheme.WHITE ? 'rgba(26, 26, 26, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              marginBottom: '20px',
              fontStyle: 'italic'
            }}
          >
            {cardData.source}
          </div>
        </div>
      </div>

      {/* 操作按钮区域 */}
      <div className="flex flex-col gap-3" style={{ width: '320px', margin: '0 auto' }}>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">🔄</span>
              生成中...
            </span>
          ) : (
            '生成高质量卡片'
          )}
        </button>

        {generatedImageUrl && (
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300"
          >
            📱 下载卡片
          </button>
        )}
      </div>
    </div>
  );
}; 