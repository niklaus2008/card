import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * 过滤浏览器扩展程序产生的错误信息
 * 这些错误不影响应用功能，只是控制台噪音
 */
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  
  // 过滤浏览器扩展相关的错误
  const extensionErrors = [
    'The message port closed before a response was received',
    'A listener indicated an asynchronous response by returning true, but the message channel closed',
    'Extension context invalidated',
    'chrome-extension://',
    'moz-extension://'
  ];
  
  // 如果是扩展错误，则不显示
  if (extensionErrors.some(error => message.includes(error))) {
    return;
  }
  
  // 其他错误正常显示
  originalConsoleError.apply(console, args);
};

/**
 * 过滤未处理的Promise拒绝中的扩展错误
 */
window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || event.reason?.toString() || '';
  
  // 如果是扩展相关的错误，阻止默认处理
  const extensionErrors = [
    'The message port closed before a response was received',
    'A listener indicated an asynchronous response by returning true, but the message channel closed'
  ];
  
  if (extensionErrors.some(error => message.includes(error))) {
    event.preventDefault();
    return;
  }
});

/**
 * 应用入口文件
 * 使用React 18的createRoot API
 */
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 