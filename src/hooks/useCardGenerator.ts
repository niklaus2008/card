import { useState, useCallback } from 'react';
import { CardData, CardTheme, CardVisualTheme } from '@/types';
import { siliconFlowService } from '@/services/siliconFlowService';
import { cardGenerator, CardGenerator, CardTheme as VisualCardTheme } from '@/utils/cardGenerator';

/**
 * 卡片生成器状态管理Hook
 * @returns {object} 卡片生成器状态和方法
 */
export const useCardGenerator = () => {
  const [cardData, setCardData] = useState<CardData>({
    content: '生于忧患，死于安乐',
    source: '— 孟子',
    date: new Date()
  });
  
  const [visualTheme, setVisualTheme] = useState<CardVisualTheme>(CardVisualTheme.CLASSIC);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  /**
   * 视觉主题映射函数
   * @param {CardVisualTheme} theme - 视觉主题
   * @returns {VisualCardTheme} Canvas生成器主题
   */
  const mapVisualTheme = (theme: CardVisualTheme): VisualCardTheme => {
    const themeMap: Record<CardVisualTheme, VisualCardTheme> = {
      [CardVisualTheme.CLASSIC]: VisualCardTheme.CLASSIC,
      [CardVisualTheme.SUNSET]: VisualCardTheme.SUNSET,
      [CardVisualTheme.OCEAN]: VisualCardTheme.OCEAN,
      [CardVisualTheme.FOREST]: VisualCardTheme.FOREST,
      [CardVisualTheme.GALAXY]: VisualCardTheme.GALAXY,
      [CardVisualTheme.AURORA]: VisualCardTheme.AURORA,
      [CardVisualTheme.WHITE]: VisualCardTheme.WHITE,
      [CardVisualTheme.BLACK]: VisualCardTheme.BLACK,
      [CardVisualTheme.GRAY]: VisualCardTheme.GRAY
    };
    return themeMap[theme];
  };

  /**
   * 更新卡片数据
   * @param {Partial<CardData>} data - 要更新的卡片数据
   */
  const updateCardData = useCallback((data: Partial<CardData>) => {
    setCardData(prev => ({ ...prev, ...data }));
    setError(null);
    // 数据更新时清除旧的生成图片
    setGeneratedImageUrl(null);
  }, []);

  /**
   * 更新视觉主题
   * @param {CardVisualTheme} theme - 新的视觉主题
   */
  const updateVisualTheme = useCallback((theme: CardVisualTheme) => {
    setVisualTheme(theme);
    setError(null);
    // 主题更新时清除旧的生成图片，需要重新生成
    setGeneratedImageUrl(null);
  }, []);

  /**
   * 生成卡片图片
   * @param {number} width - 卡片宽度，默认400
   * @param {number} height - 卡片高度，默认600
   * @returns {Promise<string | null>} 生成的图片URL
   */
  const generateCardImage = useCallback(async (width = 400, height = 600): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const canvasTheme = mapVisualTheme(visualTheme);
      const imageUrl = await cardGenerator.generateCard(cardData, canvasTheme, width, height);
      setGeneratedImageUrl(imageUrl);
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成卡片失败';
      setError(errorMessage);
      console.error('生成卡片失败:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cardData, visualTheme]);

  /**
   * 使用AI生成金句
   * @param {CardTheme} theme - 金句主题
   * @returns {Promise<boolean>} 是否生成成功
   */
  const generateQuoteWithAI = useCallback(async (theme: CardTheme = CardTheme.INSPIRATIONAL): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 先清除旧的生成图片
      setGeneratedImageUrl(null);
      
      // 现在AI服务内部已经处理了失败情况，会返回默认金句而不是抛出错误
      const aiContent = await siliconFlowService.generateQuote(theme);
      
      // 解析AI生成的内容，分离金句和出处
      const { quote, source } = siliconFlowService.parseQuoteAndSource(aiContent);
      
      updateCardData({
        content: quote,
        source: source,
        date: new Date()
      });
      
      // 如果API未配置，显示提示信息
      if (!siliconFlowService.isConfigured()) {
        setError('AI服务未配置，已使用精选默认金句');
      }
      
      return true;
    } catch (err) {
      // 这种情况下通常不会发生，因为服务层已经处理了错误
      const errorMessage = err instanceof Error ? err.message : '生成金句时发生未知错误';
      setError(errorMessage);
      console.error('生成金句时发生未知错误:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateCardData]);

  /**
   * 随机生成AI金句
   * @returns {Promise<boolean>} 是否生成成功
   */
  const generateRandomQuote = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 先清除旧的生成图片
      setGeneratedImageUrl(null);
      
      // 现在AI服务内部已经处理了失败情况，会返回默认金句而不是抛出错误
      const { content: aiContent } = await siliconFlowService.generateRandomQuote();
      
      // 解析AI生成的内容，分离金句和出处
      const { quote, source } = siliconFlowService.parseQuoteAndSource(aiContent);
      
      updateCardData({
        content: quote,
        source: source,
        date: new Date()
      });
      
      // 如果API未配置，显示提示信息
      if (!siliconFlowService.isConfigured()) {
        setError('AI服务未配置，已使用精选默认金句');
      }
      
      return true;
    } catch (err) {
      // 这种情况下通常不会发生，因为服务层已经处理了错误
      const errorMessage = err instanceof Error ? err.message : '生成金句时发生未知错误';
      setError(errorMessage);
      console.error('生成金句时发生未知错误:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateCardData]);

  /**
   * 下载卡片图片
   * @param {string} imageUrl - 图片URL
   * @param {string} filename - 自定义文件名
   */
  const downloadCard = useCallback((imageUrl?: string, filename?: string) => {
    const urlToDownload = imageUrl || generatedImageUrl;
    if (!urlToDownload) {
      setError('没有可下载的卡片图片，请先生成卡片');
      return;
    }

    try {
      const defaultFilename = `card-${CardGenerator.getFormattedDateString(cardData.date)}-${visualTheme}`;
      CardGenerator.downloadImage(urlToDownload, filename || defaultFilename);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '下载失败';
      setError(errorMessage);
      console.error('下载失败:', err);
    }
  }, [generatedImageUrl, cardData.date, visualTheme]);

  /**
   * 清除错误信息
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 重置到默认状态
   */
  const reset = useCallback(() => {
    setCardData({
      content: '生于忧患，死于安乐',
      source: '— 孟子',
      date: new Date()
    });
    setVisualTheme(CardVisualTheme.CLASSIC);
    setGeneratedImageUrl(null);
    setError(null);
  }, []);

  /**
   * 获取默认金句统计信息（用于调试或展示）
   */
  const getDefaultQuotesInfo = useCallback(() => {
    return siliconFlowService.getDefaultQuotesStats();
  }, []);

  return {
    // 状态
    cardData,
    visualTheme,
    isLoading,
    error,
    generatedImageUrl,
    isAIConfigured: siliconFlowService.isConfigured(),
    
    // 方法
    updateCardData,
    updateVisualTheme,
    generateCardImage,
    generateQuoteWithAI,
    generateRandomQuote,
    downloadCard,
    clearError,
    reset,
    getDefaultQuotesInfo
  };
}; 