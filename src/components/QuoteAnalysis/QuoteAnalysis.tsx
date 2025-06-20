import React, { useState, useEffect } from 'react';
import { siliconFlowService } from '@/services/siliconFlowService';
import { CardData } from '@/types';

/**
 * 金句解析组件的Props接口
 * @interface QuoteAnalysisProps
 */
interface QuoteAnalysisProps {
  /** 卡片数据 */
  cardData: CardData;
}

/**
 * 金句解析组件
 * 显示当前金句的详细解析和背景信息
 * @param {QuoteAnalysisProps} props - 组件属性
 * @returns {JSX.Element} 金句解析组件
 */
export const QuoteAnalysis: React.FC<QuoteAnalysisProps> = ({
  cardData
}) => {
  const [quoteExplanation, setQuoteExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  /**
   * 异步获取金句解释
   */
  useEffect(() => {
    const getQuoteExplanation = async () => {
      if (!cardData.content || !cardData.source) {
        setQuoteExplanation(null);
        return;
      }
      
      setIsLoadingExplanation(true);
      
      try {
        // 构建完整的金句内容（包含出处）
        const fullQuoteContent = `${cardData.content} ${cardData.source}`;
        
        // 先尝试完整匹配
        let explanation = await siliconFlowService.getQuoteExplanation(fullQuoteContent);
        
        // 如果完整匹配失败，尝试只用内容匹配
        if (!explanation) {
          explanation = await siliconFlowService.getQuoteExplanation(cardData.content);
        }
        
        // 如果还是没有匹配到，尝试去掉空格后匹配
        if (!explanation) {
          const trimmedContent = cardData.content.trim();
          explanation = await siliconFlowService.getQuoteExplanation(trimmedContent);
        }
        
        setQuoteExplanation(explanation);
      } catch (error) {
        console.error('获取金句解释失败:', error);
        setQuoteExplanation(null);
      } finally {
        setIsLoadingExplanation(false);
      }
    };

    getQuoteExplanation();
  }, [cardData.content, cardData.source]);

  // 如果没有内容，不显示组件
  if (!cardData.content) {
    return null;
  }

  return (
    <div className="glass-effect p-3 rounded-2xl">
      <h3 className="text-white font-semibold mb-2 flex items-center">
        <span className="mr-2">📖</span>
        <span className="text-white/90 text-sm font-medium">金句解析</span>
      </h3>
      
      {isLoadingExplanation ? (
        <div className="flex items-center justify-center py-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/70"></div>
          <span className="ml-2 text-white/80 text-xs font-medium">正在生成解释...</span>
        </div>
      ) : quoteExplanation ? (
        <div className="bg-white/10 rounded-lg p-3 border border-white/20">
          <p className="text-white/95 text-xs leading-relaxed">
            {quoteExplanation}
          </p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-lg p-3 border border-white/15">
          <p className="text-white/70 text-xs leading-relaxed italic">
            抱歉，暂时无法为这句金句提供解释。请尝试输入其他金句，或检查网络连接。
          </p>
        </div>
      )}
    </div>
  );
}; 