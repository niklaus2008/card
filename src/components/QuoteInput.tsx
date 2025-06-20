import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { siliconFlowService } from '@/services/siliconFlowService';
import { CardTheme } from '@/types';

interface QuoteInputProps {
  onQuoteChange: (quote: string, author: string) => void;
  onGenerateCard: () => void;
}

const QuoteInput: React.FC<QuoteInputProps> = ({ onQuoteChange, onGenerateCard }) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quoteExplanation, setQuoteExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  /**
   * 移除文本中所有括号内的说明性内容和破折号分隔符
   * @param {string} text - 原始文本
   * @returns {string} 清理后的文本
   */
  const removeNoteText = (text: string): string => {
    // 匹配所有类型的括号内的说明性内容
    // 支持：注、解析、说明、备注、提示、补充等开头的内容
    const notePatterns = [
      // 中文圆括号
      /（(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^）]*）/g,
      // 英文圆括号  
      /\((?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^)]*\)/g,
      // 中文方括号
      /【(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^】]*】/g,
      // 英文方括号
      /\[(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^\]]*\]/g,
      // 中文六角括号
      /〔(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^〕]*〕/g,
      // 中文尖括号
      /〈(?:注|解析|说明|备注|提示|补充|附注|详解|释义|注释)[：:][^〉]*〉/g
    ];
    
    let cleanedText = text;
    
    // 逐个应用清理规则
    notePatterns.forEach(pattern => {
      cleanedText = cleanedText.replace(pattern, '');
    });
    
    // 移除破折号分隔符及其后面的内容（确保编辑框中不出现破折号）
    const dashIndex = cleanedText.indexOf('—');
    if (dashIndex !== -1) {
      cleanedText = cleanedText.substring(0, dashIndex).trim();
    }
    
    // 清理多余的空格和标点
    cleanedText = cleanedText
      .replace(/\s+/g, ' ')     // 多个空格合并为一个
      .replace(/\s*([。，、；：！？])\s*/g, '$1')  // 清理标点符号周围的空格
      .trim();
    
    // 修复双引号匹配问题
    cleanedText = fixQuoteMatching(cleanedText);
    
    return cleanedText;
  };

  /**
   * 修复双引号匹配问题
   * @param {string} text - 需要修复的文本
   * @returns {string} 修复后的文本
   */
  const fixQuoteMatching = (text: string): string => {
    // 统计各种引号的数量
    const leftDoubleQuotes = (text.match(/"/g) || []).length;  // 左双引号
    const rightDoubleQuotes = (text.match(/"/g) || []).length; // 右双引号
    const straightQuotes = (text.match(/"/g) || []).length;    // 直引号
    
    // 如果文本中没有任何引号，直接返回，不添加引号
    if (leftDoubleQuotes === 0 && rightDoubleQuotes === 0 && straightQuotes === 0) {
      return text;
    }
    
    // 如果有不匹配的弯引号，尝试修复
    if (leftDoubleQuotes !== rightDoubleQuotes) {
      // 如果只有右引号，没有左引号，在开头添加左引号
      if (leftDoubleQuotes === 0 && rightDoubleQuotes > 0) {
        text = '"' + text;
      }
      // 如果只有左引号，没有右引号，在结尾添加右引号
      else if (leftDoubleQuotes > 0 && rightDoubleQuotes === 0) {
        text = text + '"';
      }
      // 如果左右引号数量不匹配，统一使用直引号
      else if (Math.abs(leftDoubleQuotes - rightDoubleQuotes) > 0) {
        text = text.replace(/[""]/g, '"');
      }
    }
    
    // 处理直引号的配对问题（只在有直引号的情况下）
    if (straightQuotes > 0) {
      // 如果直引号数量是奇数，说明不配对
      if (straightQuotes % 2 === 1) {
        // 检查是否以引号开头但没有结尾引号
        if (text.startsWith('"') && !text.endsWith('"')) {
          text = text + '"';
        }
        // 检查是否以引号结尾但没有开头引号
        else if (text.endsWith('"') && !text.startsWith('"')) {
          text = '"' + text;
        }
      }
    }
    
    return text;
  };

  const handleQuoteChange = (value: string) => {
    // 清理注释内容
    const cleanedValue = removeNoteText(value);
    setQuote(cleanedValue);
    onQuoteChange(cleanedValue, author);
  };

  const handleAuthorChange = (value: string) => {
    // 清理注释内容
    const cleanedValue = removeNoteText(value);
    setAuthor(cleanedValue);
    onQuoteChange(quote, cleanedValue);
  };

  const handleQuickRandomQuote = () => {
    // 纯本地随机，秒速响应
    const themes = Object.values(CardTheme);
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const defaultQuotes = siliconFlowService.getDefaultQuotesByTheme(randomTheme);
    const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
    
    const { quote: quoteContent, source } = siliconFlowService.parseQuoteAndSource(randomQuote.content);
    setQuote(quoteContent);
    setAuthor(source);
    onQuoteChange(quoteContent, source);
  };

  const handleRandomQuote = async () => {
    setIsGenerating(true);
    try {
      // 优化策略：80%概率使用本地随机，20%概率使用AI生成
      const useLocalRandom = Math.random() < 0.8;
      
      if (useLocalRandom) {
        // 本地快速随机：从默认金句库中随机选择
        const defaultQuotes = siliconFlowService.getDefaultQuotesByTheme(CardTheme.INSPIRATIONAL);
        const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
        
        const { quote: quoteContent, source } = siliconFlowService.parseQuoteAndSource(randomQuote.content);
        setQuote(quoteContent);
        setAuthor(source);
        onQuoteChange(quoteContent, source);
      } else {
        // AI生成（保持原有逻辑）
        const result = await siliconFlowService.generateRandomQuote();
        const { quote: quoteContent, source } = siliconFlowService.parseQuoteAndSource(result.content);
        setQuote(quoteContent);
        setAuthor(source);
        onQuoteChange(quoteContent, source);
      }
    } catch (error) {
      console.error('生成随机金句失败:', error);
      // 失败时使用本地随机作为后备
      const defaultQuotes = siliconFlowService.getDefaultQuotesByTheme(CardTheme.INSPIRATIONAL);
      const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
      
      const { quote: quoteContent, source } = siliconFlowService.parseQuoteAndSource(randomQuote.content);
      setQuote(quoteContent);
      setAuthor(source);
      onQuoteChange(quoteContent, source);
    } finally {
      setIsGenerating(false);
    }
  };

  // 异步获取金句解释
  useEffect(() => {
    const fetchExplanation = async () => {
      if (!quote) {
        setQuoteExplanation(null);
        return;
      }
      
      setIsLoadingExplanation(true);
      
      try {
        // 构建完整的金句内容（包含出处）
        const fullQuoteContent = `${quote} ${author || ''}`.trim();
        
        // 先尝试完整匹配
        let explanation = await siliconFlowService.getQuoteExplanation(fullQuoteContent);
        
        // 如果完整匹配失败，尝试只用内容匹配
        if (!explanation) {
          explanation = await siliconFlowService.getQuoteExplanation(quote);
        }
        
        // 如果还是没有匹配到，尝试去掉空格后匹配
        if (!explanation) {
          const trimmedContent = quote.trim();
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

    fetchExplanation();
  }, [quote, author]);

  return (
    <Card className="glass-effect p-6 shadow-xl">
      <div className="space-y-4">
        {/* 输入金句区域 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label htmlFor="quote" className="text-label-soft label-enhanced text-lg font-bold">
              输入您的金句
            </Label>
            <div className="flex gap-2">
              <Button 
                onClick={handleQuickRandomQuote}
                variant="outline"
                size="sm"
                className="bg-white/30 backdrop-blur-md border-white/40 text-white hover:bg-white/40 hover:border-white/60 shadow-lg btn-text-enhanced text-sm px-3 py-2 transition-all duration-300 hover:shadow-white/25 hover:scale-105"
              >
                ⚡ 快速随机
              </Button>
              <Button 
                onClick={handleRandomQuote}
                variant="outline"
                size="sm"
                disabled={isGenerating}
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:border-white/50 shadow-lg btn-text-enhanced text-sm px-4 py-2 transition-all duration-300 hover:shadow-white/25 hover:scale-105"
              >
                {isGenerating ? '🤖 AI生成中...' : '🤖 AI随机'}
              </Button>
            </div>
          </div>
          <Textarea
            id="quote"
            placeholder="输入您喜欢的金句或励志语录..."
            value={quote}
            onChange={(e) => handleQuoteChange(e.target.value)}
            className="input-enhanced text-dark-enhanced placeholder-dark-enhanced resize-none font-bold text-xl leading-relaxed"
            rows={4}
          />
          <div className="text-right text-sm mt-2 font-bold">
            <span className="counter-enhanced">
              {quote.length}/200 字符
            </span>
          </div>
        </div>

        {/* 作者/来源区域 */}
        <div>
          <Label htmlFor="author" className="text-label-soft label-enhanced text-lg font-bold mb-3 block">
            作者/来源
          </Label>
          <Input
            id="author"
            placeholder="输入作者名称或来源"
            value={author}
            onChange={(e) => handleAuthorChange(e.target.value)}
            className="input-enhanced text-dark-enhanced placeholder-dark-enhanced font-bold text-xl"
          />
        </div>

        {/* 按钮区域 - 模仿截图布局 */}
        <div className="flex gap-3">
          <Button 
            onClick={onGenerateCard}
            className="flex-1 btn-primary-enhanced btn-text-enhanced py-4 text-lg"
          >
            生成卡片
          </Button>
          <Button 
            onClick={() => {
              setQuote('');
              setAuthor('');
              onQuoteChange('', '');
            }}
            variant="outline"
            className="bg-white/15 backdrop-blur-md border-white/25 text-white hover:bg-white/25 hover:border-white/40 shadow-lg px-8 py-4 btn-text-enhanced text-base transition-all duration-300 hover:shadow-white/20 hover:scale-105"
          >
            清空
          </Button>
        </div>

        {/* 金句解释板块 */}
        {quote && (
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/25 mt-4 shadow-lg">
            <h3 className="text-white-enhanced font-bold text-lg mb-3 flex items-center">
              <span className="mr-2">📖</span>
              <span className="label-enhanced px-3 py-1 text-base">金句解释</span>
            </h3>
            {isLoadingExplanation ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/70"></div>
                <span className="ml-3 text-white/80 text-base font-medium">正在生成解释...</span>
              </div>
            ) : quoteExplanation ? (
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <p className="text-white/95 text-base leading-relaxed font-medium">
                  {quoteExplanation}
                </p>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-4 border border-white/15">
                <p className="text-white/70 text-base leading-relaxed italic">
                  抱歉，暂时无法为这句金句提供解释。请尝试输入其他金句，或检查网络连接。
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuoteInput; 