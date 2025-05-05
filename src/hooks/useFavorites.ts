import { useState, useEffect, useRef } from 'react';

export const useFavorites = () => {
  // 使用useRef标记是否已初始化
  const isInitialized = useRef(false);
  
  // 从localStorage获取初始收藏列表
  const getInitialFavorites = (): string[] => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          console.log('从localStorage加载收藏列表(初始化):', parsedFavorites);
          return parsedFavorites;
        }
      }
    } catch (error) {
      console.error('解析初始收藏列表失败:', error);
    }
    return [];
  };
  
  // 从localStorage获取初始显示设置
  const getInitialShowFavorites = (): boolean => {
    try {
      const savedShowFavorites = localStorage.getItem('showFavorites');
      return savedShowFavorites === 'true';
    } catch (error) {
      console.error('解析初始显示收藏设置失败:', error);
      return false;
    }
  };

  // 使用从localStorage获取的数据初始化状态
  const [favorites, setFavorites] = useState<string[]>(getInitialFavorites());
  const [showFavorites, setShowFavorites] = useState<boolean>(getInitialShowFavorites());

  // 保存收藏到本地存储 - 只在favorites变化时保存
  useEffect(() => {
    // 跳过初始渲染的保存操作
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    
    try {
      const jsonString = JSON.stringify(favorites);
      localStorage.setItem('favorites', jsonString);
      console.log('保存收藏列表到localStorage:', favorites);
    } catch (error) {
      console.error('保存收藏列表失败:', error);
    }
  }, [favorites]);

  // 保存显示收藏设置
  useEffect(() => {
    // 只在状态变化后保存，跳过初始化保存
    if (!isInitialized.current) {
      return;
    }
    
    try {
      localStorage.setItem('showFavorites', String(showFavorites));
      console.log('保存显示收藏设置:', showFavorites);
    } catch (error) {
      console.error('保存显示收藏设置失败:', error);
    }
  }, [showFavorites]);

  // 切换收藏状态
  const toggleFavorite = (id: string) => {
    console.log('切换收藏状态:', id, '当前收藏列表:', favorites);
    
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      // 直接在状态更新时保存到localStorage，确保立即保存
      try {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        console.log('立即保存收藏列表:', newFavorites);
      } catch (error) {
        console.error('切换收藏状态时保存失败:', error);
      }
      
      return newFavorites;
    });
  };

  // 切换显示全部/仅收藏
  const toggleShowFavorites = () => {
    setShowFavorites(prev => {
      const newValue = !prev;
      // 直接在状态更新时保存到localStorage
      try {
        localStorage.setItem('showFavorites', String(newValue));
        console.log('保存显示收藏设置:', newValue);
      } catch (error) {
        console.error('保存显示收藏设置失败:', error);
      }
      return newValue;
    });
  };

  // 检查是否收藏
  const isFavorite = (id: string) => favorites.includes(id);

  // 调试输出当前收藏列表
  useEffect(() => {
    console.log('当前管理的收藏列表:', favorites);
  }, [favorites]);

  return {
    favorites,
    showFavorites,
    toggleFavorite,
    toggleShowFavorites,
    isFavorite
  };
}; 