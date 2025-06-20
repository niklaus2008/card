import React, { useState, useCallback } from 'react';
import { CardTheme } from '@/types';

/**
 * 主题选项配置
 */
const THEME_OPTIONS = [
  { value: CardTheme.INSPIRATIONAL, label: '励志金句', emoji: '💪', description: '名人名言、影视剧台词、励志歌词等' },
  { value: CardTheme.PHILOSOPHICAL, label: '哲理金句', emoji: '🤔', description: '哲学家名言、文学作品、经典台词等' },
  { value: CardTheme.EMOTIONAL, label: '情感金句', emoji: '❤️', description: '爱情电影台词、流行歌词、文学作品等' },
  { value: CardTheme.LIFE, label: '生活感悟', emoji: '🌱', description: '生活类书籍、综艺节目、纪录片等' },
  { value: CardTheme.WISDOM, label: '智慧格言', emoji: '💡', description: '古代先贤、经典著作、智慧影视等' }
];

/**
 * AI生成器组件的Props接口
 * @interface AIGeneratorProps
 */
interface AIGeneratorProps {
  /** 是否正在加载 */
  isLoading: boolean;
  /** AI服务是否已配置 */
  isAIConfigured: boolean;
  /** 错误信息 */
  error: string | null;
  /** 生成指定主题金句的回调函数 */
  onGenerateThemeQuote: (theme: CardTheme) => Promise<boolean>;
  /** 生成随机金句的回调函数 */
  onGenerateRandomQuote: () => Promise<boolean>;
  /** 清除错误的回调函数 */
  onClearError: () => void;
}

/**
 * AI金句生成器组件
 * 提供AI生成金句的功能界面
 * @param {AIGeneratorProps} props - 组件属性
 * @returns {JSX.Element} AI生成器组件
 */
export const AIGenerator: React.FC<AIGeneratorProps> = ({
  isLoading,
  isAIConfigured,
  error,
  onGenerateThemeQuote,
  onGenerateRandomQuote,
  onClearError
}) => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>(CardTheme.INSPIRATIONAL);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  /**
   * 处理主题选择
   * @param {CardTheme} theme - 选择的主题
   */
  const handleThemeSelect = useCallback((theme: CardTheme) => {
    setSelectedTheme(theme);
    setShowThemeSelector(false);
    onClearError();
  }, [onClearError]);

  /**
   * 处理生成指定主题金句
   */
  const handleGenerateThemeQuote = useCallback(async () => {
    await onGenerateThemeQuote(selectedTheme);
  }, [selectedTheme, onGenerateThemeQuote]);

  /**
   * 处理生成随机金句
   */
  const handleGenerateRandomQuote = useCallback(async () => {
    await onGenerateRandomQuote();
  }, [onGenerateRandomQuote]);

  /**
   * 切换主题选择器显示状态
   */
  const toggleThemeSelector = useCallback(() => {
    setShowThemeSelector(prev => !prev);
  }, []);

  const selectedThemeOption = THEME_OPTIONS.find(option => option.value === selectedTheme);

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          AI金句生成器
        </h2>
        <p className="text-white/80">
          {isAIConfigured 
            ? '从影视剧、名著、歌词等丰富来源生成金句' 
            : '精选默认金句，无需配置即可使用'
          }
        </p>
      </div>

      {/* AI生成控制面板 */}
      <div className="card-container animate-fade-in">
        {/* 状态提示 */}
        {!isAIConfigured && (
          <div className="text-center p-3 bg-blue-50 rounded-md mb-4 border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <span className="text-blue-600 mr-2">ℹ️</span>
              <span className="font-medium text-blue-800">使用精选默认金句</span>
            </div>
            <p className="text-sm text-blue-600">
              AI服务未配置，将从精心挑选的{Object.keys(CardTheme).length * 8}句经典金句中随机选择
            </p>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="error-message text-center p-3 bg-red-50 rounded-md mb-4">
            {error.includes('未配置') ? (
              <div className="flex items-center justify-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <span className="text-yellow-800">{error}</span>
              </div>
            ) : (
              <>❌ {error}</>
            )}
          </div>
        )}

        {/* 主题选择 */}
        <div className="mb-6">
          <label className="input-label">选择金句主题:</label>
          <div className="relative">
            <button
              type="button"
              onClick={toggleThemeSelector}
              disabled={isLoading}
              className="input-field text-left flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center">
                <span className="mr-2 text-lg">
                  {selectedThemeOption?.emoji}
                </span>
                {selectedThemeOption?.label}
              </span>
              <span className={`transform transition-transform ${showThemeSelector ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* 主题下拉选项 */}
            {showThemeSelector && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
                {THEME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleThemeSelect(option.value)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-start border-b border-gray-100 last:border-b-0"
                  >
                    <span className="mr-3 text-lg mt-0.5">
                      {option.emoji}
                    </span>
                    <div>
                      <div className="font-medium text-gray-800">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 生成按钮 */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGenerateThemeQuote}
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner mr-2"></span>
                生成中...
              </>
            ) : (
              <>
                <span className="mr-2">🎯</span>
                生成 {selectedThemeOption?.label}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleGenerateRandomQuote}
            disabled={isLoading}
            className="btn-secondary w-full"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner mr-2"></span>
                生成中...
              </>
            ) : (
              <>
                <span className="mr-2">🎲</span>
                随机生成金句
              </>
            )}
          </button>
        </div>

        {/* 功能说明 */}
        <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-md">
          <p className="font-medium mb-2">
            {isAIConfigured ? '🎬 AI功能升级说明：' : '📚 默认金句库说明：'}
          </p>
          <ul className="list-disc list-inside space-y-1">
            {isAIConfigured ? (
              <>
                <li><strong>丰富来源</strong>：涵盖影视剧台词、名人名言、名著语录、流行歌词等</li>
                <li><strong>具体出处</strong>：每句金句都会标注具体来源，如电影名、作者名等</li>
                <li><strong>主题分类</strong>：根据不同主题匹配相应风格的来源内容</li>
                <li><strong>智能后备</strong>：AI生成失败时自动使用精选默认金句</li>
              </>
            ) : (
              <>
                <li><strong>精选内容</strong>：每个主题包含8句精心挑选的经典金句</li>
                <li><strong>权威出处</strong>：所有金句都标注真实、可信的来源信息</li>
                <li><strong>即时可用</strong>：无需配置API，立即享受高质量金句服务</li>
                <li><strong>覆盖全面</strong>：涵盖励志、哲理、情感、生活、智慧五大主题</li>
              </>
            )}
          </ul>
        </div>

        {/* API配置提示 */}
        {!isAIConfigured && (
          <div className="text-xs text-gray-400 mt-3 p-2 bg-gray-100 rounded border-l-4 border-blue-400">
            <p className="font-medium text-gray-600 mb-1">💡 想要更多AI生成内容？</p>
            <p>配置硅基流动API Key即可解锁无限AI生成功能！</p>
          </div>
        )}
      </div>
    </div>
  );
}; 