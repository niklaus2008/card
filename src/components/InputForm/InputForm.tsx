import React, { useState, useCallback, useEffect } from 'react';

/**
 * 输入表单组件的Props接口
 * @interface InputFormProps
 */
interface InputFormProps {
  /** 当前内容 */
  content: string;
  /** 当前来源 */
  source: string;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否配置了AI服务 */
  isAIConfigured: boolean;
  /** 内容变化的回调函数 */
  onContentChange: (content: string, source: string) => void;
  /** AI生成的回调函数 */
  onAIGenerate: () => Promise<boolean>;
  /** 清除错误的回调函数 */
  onClearError: () => void;
}

/**
 * 输入表单组件
 * 提供用户输入金句和来源的界面，支持AI生成
 * @param {InputFormProps} props - 组件属性
 * @returns {JSX.Element} 输入表单组件
 */
export const InputForm: React.FC<InputFormProps> = ({
  content,
  source,
  isLoading,
  isAIConfigured,
  onContentChange,
  onAIGenerate,
  onClearError
}) => {
  const [localContent, setLocalContent] = useState(content);
  const [localSource, setLocalSource] = useState(source);

  // 当外部props更新时，同步本地状态
  useEffect(() => {
    setLocalContent(content);
    setLocalSource(source);
  }, [content, source]);

  /**
   * 处理内容输入变化
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - 输入事件
   */
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalContent(value);
    onContentChange(value, localSource);
    onClearError();
  }, [localSource, onContentChange, onClearError]);

  /**
   * 处理来源输入变化
   * @param {React.ChangeEvent<HTMLInputElement>} e - 输入事件
   */
  const handleSourceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSource(value);
    onContentChange(localContent, value);
    onClearError();
  }, [localContent, onContentChange, onClearError]);

  /**
   * 处理AI生成按钮点击
   */
  const handleAIGenerate = useCallback(async () => {
    await onAIGenerate();
  }, [onAIGenerate]);

  /**
   * 处理快速清空
   */
  const handleClear = useCallback(() => {
    setLocalContent('');
    setLocalSource('');
    onContentChange('', '');
    onClearError();
  }, [onContentChange, onClearError]);

  return (
    <div className="glass-effect p-4 rounded-2xl space-y-4">
      {/* 内容输入 */}
      <div className="space-y-1">
        {/* 标签和按钮的水平布局 */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-white/90 text-xs font-medium">
            ✏️ 金句内容
          </label>
          
          {/* 生成按钮组 */}
          <div className="flex gap-2">
            {/* 快速随机金句按钮 */}
            <button
              onClick={handleAIGenerate}
              disabled={isLoading}
              className="px-2 py-1 text-xs rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-1">⚡</span>
                  生成中
                </>
              ) : (
                <>
                  <span className="mr-1">⚡</span>
                  快速随机金句
                </>
              )}
            </button>

            {/* AI生成按钮 */}
            {isAIConfigured && (
              <button
                onClick={handleAIGenerate}
                disabled={isLoading}
                className="px-2 py-1 text-xs rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-1">🤖</span>
                    AI生成中
                  </>
                ) : (
                  <>
                    <span className="mr-1">🤖</span>
                    AI随机金句
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        <textarea
          className="input-enhanced w-full min-h-[100px] rounded-xl placeholder-dark-enhanced resize-none"
          rows={3}
          placeholder="输入您的金句内容，或点击上方按钮生成...（建议80字以内，避免文字压盖）"
          value={localContent}
          onChange={handleContentChange}
          disabled={isLoading}
          maxLength={80}
        />
        <div className="flex justify-between items-center text-xs">
          {/* 字数警告提示 */}
          {localContent.length > 60 && (
            <span className="text-yellow-300 text-xs">
              ⚠️ 内容较长，可能影响卡片显示效果
            </span>
          )}
          <span className="counter-enhanced ml-auto">
            {localContent.length}/80 字符
          </span>
        </div>
      </div>

      {/* 来源输入 */}
      <div className="space-y-1">
        <label className="text-white/90 text-xs font-medium">
          📝 来源
        </label>
        <input
          type="text"
          className="input-enhanced w-full rounded-xl placeholder-dark-enhanced"
          placeholder="请输入来源、作者或出处..."
          value={localSource}
          onChange={handleSourceChange}
          disabled={isLoading}
          maxLength={50}
        />
        {/* 清空内容按钮 - 放在来源输入框右下角 */}
        <div className="flex justify-end">
          {(localContent || localSource) && (
            <button
              onClick={handleClear}
              className="px-2 py-1 text-xs rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-1">🗑️</span>
                  清空中
                </>
              ) : (
                <>
                  <span className="mr-1">🗑️</span>
                  清空内容
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 