import React from 'react';

interface QuoteCardProps {
  quote: string;
  author?: string;
  theme?: 'default' | 'sunset' | 'ocean' | 'forest' | 'galaxy' | 'aurora';
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  author = "佚名",
  theme = "default"
}) => {
  // 获取当前日期和星期
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];

  // 获取主题类名
  const getThemeClass = () => {
    switch (theme) {
      case 'sunset': return 'card-theme-sunset';
      case 'ocean': return 'card-theme-ocean';
      case 'forest': return 'card-theme-forest';
      case 'galaxy': return 'card-theme-galaxy';
      case 'aurora': return 'card-theme-aurora';
      default: return '';
    }
  };

  return (
    <div className="relative max-w-md mx-auto">
      {/* 卡片主体 */}
      <div className={`card-preview ${getThemeClass()}`}>
        {/* 日期部分 */}
        <div className="text-center">
          <div className="card-date">
            {day}
          </div>
          <div className="card-meta">
            <div>{year}.{month}.{day}</div>
            <div className="text-base mt-1">{weekday}</div>
          </div>
        </div>
        
        {/* 金句内容 */}
        <div className="card-content">
          {quote || "在此输入您的金句..."}
        </div>
        
        {/* 作者署名 */}
        <div className="card-source">
          — {author}
        </div>
      </div>
      
      {/* 装饰性光晕效果 */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
        <div className={`w-full h-full rounded-3xl ${getThemeClass()}`}></div>
      </div>
    </div>
  );
};

export default QuoteCard; 