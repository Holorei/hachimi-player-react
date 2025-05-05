import { useState, useEffect, useRef } from 'react';
import { Theme } from '../types';

// 直接从localStorage获取存储的主题设置
const getSavedTheme = (): Theme => {
  try {
    const savedTheme = localStorage.getItem('theme') as Theme;
    console.log('getSavedTheme - 读取主题设置:', savedTheme);
    
    if (savedTheme && (savedTheme === Theme.LIGHT || savedTheme === Theme.DARK)) {
      return savedTheme;
    }
    
    // 根据系统偏好设置主题
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDarkMode ? Theme.DARK : Theme.LIGHT;
  } catch (error) {
    console.error('获取存储的主题设置失败:', error);
    return Theme.LIGHT; // 默认值
  }
};

export const useTheme = () => {
  // 使用获取到的存储值初始化状态
  const [theme, setTheme] = useState<Theme>(getSavedTheme());
  const isInitialized = useRef(false);

  // 标记初始化完成
  useEffect(() => {
    isInitialized.current = true;
  }, []);

  // 应用主题并保存设置
  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }
    
    try {
      document.body.className = theme;
      
      // 使用同步方式保存主题设置
      localStorage.setItem('theme', theme);
      console.log('保存主题设置:', theme);
      
      // 确认设置已保存
      setTimeout(() => {
        const savedTheme = localStorage.getItem('theme');
        console.log('延迟验证主题保存结果:', savedTheme);
      }, 100);
    } catch (error) {
      console.error('保存主题设置失败:', error);
    }
  }, [theme]);

  // 切换主题
  const toggleTheme = () => {
    console.log('切换主题，当前:', theme);
    setTheme(prevTheme => {
      const newTheme = prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      
      // 立即保存到localStorage
      try {
        localStorage.setItem('theme', newTheme);
        console.log('立即保存新主题:', newTheme);
        
        // 验证是否保存成功
        const savedTheme = localStorage.getItem('theme');
        console.log('验证主题保存结果:', savedTheme);
      } catch (error) {
        console.error('保存主题设置失败:', error);
      }
      
      return newTheme;
    });
  };

  return {
    theme,
    toggleTheme
  };
}; 