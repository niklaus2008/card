import React, { useState } from 'react';
import { useCardGenerator } from '@/hooks/useCardGenerator';
import { InputForm } from '@/components/InputForm/InputForm';
import { CardPreview } from '@/components/CardPreview/CardPreview';
import { AIGenerator } from '@/components/AIGenerator/AIGenerator';

/**
 * 应用模式枚举
 */
enum AppMode {
  MANUAL = 'manual',
  AI = 'ai'
}

/**
 * 主卡片生成器组件
 * 整合所有子组件，提供完整的卡片生成功能
 * @returns {JSX.Element} 主卡片生成器组件
 */
export const CardGenerator: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.MANUAL);
  
  const {
    // 状态
    cardData,
    visualTheme,
    isLoading,
    error,
    generatedImageUrl,
    isAIConfigured,
    
    // 方法
    updateCardData,
    generateCardImage,
    generateQuoteWithAI,
    generateRandomQuote,
    downloadCard,
    clearError,
    reset
  } = useCardGenerator();

  /**
   * 处理模式切换
   * @param {AppMode} mode - 要切换到的模式
   */
  const handleModeSwitch = (mode: AppMode) => {
    setCurrentMode(mode);
    clearError();
  };

  /**
   * 处理重置操作
   */
  const handleReset = () => {
    reset();
    setCurrentMode(AppMode.MANUAL);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部导航 */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-lg p-1 mb-6">
            <button
              onClick={() => handleModeSwitch(AppMode.MANUAL)}
              className={`px-4 py-2 rounded-md transition-all ${
                currentMode === AppMode.MANUAL
                  ? 'bg-white text-gray-800 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              ✏️ 手动输入
            </button>
            <button
              onClick={() => handleModeSwitch(AppMode.AI)}
              className={`px-4 py-2 rounded-md transition-all ${
                currentMode === AppMode.AI
                  ? 'bg-white text-gray-800 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🤖 AI生成
            </button>
          </div>

          {/* 重置按钮 */}
          <button
            onClick={handleReset}
            className="text-white/60 hover:text-white text-sm underline"
          >
            🔄 重置所有内容
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              <div className="flex items-center justify-between">
                <span>❌ {error}</span>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-8">
            {currentMode === AppMode.MANUAL ? (
              <InputForm
                content={cardData.content}
                source={cardData.source}
                isLoading={isLoading}
                isAIConfigured={isAIConfigured}
                onContentChange={(content, source) => updateCardData({ content, source, date: cardData.date })}
                onAIGenerate={generateRandomQuote}
                onClearError={clearError}
              />
            ) : (
              <AIGenerator
                isLoading={isLoading}
                isAIConfigured={isAIConfigured}
                error={error}
                onGenerateThemeQuote={generateQuoteWithAI}
                onGenerateRandomQuote={generateRandomQuote}
                onClearError={clearError}
              />
            )}
          </div>

          {/* 右侧：预览区域 */}
          <div>
            <CardPreview
              cardData={cardData}
              visualTheme={visualTheme}
              generatedImageUrl={generatedImageUrl}
              isLoading={isLoading}
              onGenerateCard={generateCardImage}
              onDownloadCard={downloadCard}
            />
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-12 text-center text-white/60 text-sm">
          <p className="mb-2">
            ✨ 日历卡片生成器 - 让每一天都充满意义
          </p>
          <div className="flex justify-center space-x-4 text-xs">
            <span>📱 支持移动端</span>
            <span>🎨 精美设计</span>
            <span>🤖 AI智能生成</span>
            <span>💾 一键下载</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 