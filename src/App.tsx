import React from 'react';
import { InputForm } from '@/components/InputForm';
import { CardPreview } from '@/components/CardPreview';
import { QuoteAnalysis } from '@/components/QuoteAnalysis';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useCardGenerator } from '@/hooks/useCardGenerator';
import { CardVisualTheme } from '@/types';
import '@/styles/globals.css';

/**
 * 主应用组件
 * React 18应用的根组件，集成卡片生成功能
 * @returns {JSX.Element} 主应用组件
 */
const App: React.FC = () => {
  const {
    cardData,
    visualTheme,
    isLoading,
    error,
    generatedImageUrl,
    isAIConfigured,
    updateCardData,
    updateVisualTheme,
    generateCardImage,
    generateRandomQuote,
    downloadCard,
    clearError,
    reset
  } = useCardGenerator();

  /**
   * 处理卡片数据更新
   */
  const handleCardDataChange = (content: string, source: string) => {
    updateCardData({
      content,
      source,
      date: new Date()
    });
  };

  /**
   * 处理视觉主题更新
   */
  const handleVisualThemeChange = (theme: CardVisualTheme) => {
    updateVisualTheme(theme);
  };

  /**
   * 处理生成卡片
   */
  const handleGenerateCard = async () => {
    await generateCardImage();
  };

  /**
   * 处理AI生成金句
   */
  const handleAIGenerate = async (): Promise<boolean> => {
    return await generateRandomQuote();
  };

  /**
   * 处理下载卡片
   */
  const handleDownload = (imageUrl?: string, filename?: string) => {
    downloadCard(imageUrl, filename);
  };

  /**
   * 处理错误清除
   */
  const handleClearError = () => {
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500">
      {/* 顶部标题 - 减少padding */}
      <header className="text-center py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          📸 精美卡片生成器
        </h1>
        
      </header>

      {/* 主要内容区域 - 减少padding */}
      <main className="container mx-auto px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* 左侧输入区域 - 减少间距 */}
          <div className="space-y-4">
            <div className="text-center lg:text-left">
              <h2 className="text-xl font-bold text-white mb-1">
                ✍️ 创作您的金句
              </h2>
            </div>
            
            <InputForm 
              content={cardData.content}
              source={cardData.source}
              isLoading={isLoading}
              isAIConfigured={isAIConfigured}
              onContentChange={handleCardDataChange}
              onAIGenerate={handleAIGenerate}
              onClearError={handleClearError}
            />

            {/* 错误提示 */}
            {error && (
              <div className="glass-effect p-3 rounded-xl border-l-4 border-yellow-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-2">⚠️</span>
                    <span className="text-white text-sm">{error}</span>
                  </div>
                  <button
                    onClick={handleClearError}
                    className="text-white/70 hover:text-white ml-4"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* 主题选择器 */}
            <ThemeSelector 
              selectedTheme={visualTheme}
              onThemeChange={handleVisualThemeChange}
            />

            {/* 金句解析 */}
            <QuoteAnalysis cardData={cardData} />
          </div>

          {/* 右侧预览区域 - 减少间距 */}
          <div className="space-y-4">
            <CardPreview 
              cardData={cardData}
              visualTheme={visualTheme}
              generatedImageUrl={generatedImageUrl}
              isLoading={isLoading}
              onGenerateCard={handleGenerateCard}
              onDownloadCard={handleDownload}
            />
          </div>
        </div>

        {/* 快捷操作栏 */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={reset}
            className="glass-effect p-2 rounded-full text-white hover:bg-white/10 transition-all duration-300"
            title="重置所有设置"
          >
            🔄
          </button>
          {generatedImageUrl && (
            <button
              onClick={() => handleDownload()}
              className="bg-green-500 hover:bg-green-600 p-2 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
              title="快速下载"
            >
              📥
            </button>
          )}
        </div>
      </main>

      {/* 底部版权信息 - 减少padding */}
      <footer className="text-center py-2 text-white/60">
        <p className="text-sm">© 强哥的 精美卡片生成器 - 让每一句话都有美好呈现</p>
      </footer>
    </div>
  );
};

export default App; 