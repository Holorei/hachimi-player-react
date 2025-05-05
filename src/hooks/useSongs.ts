import { useState, useEffect } from 'react';
import { Song } from '../types';
import songListData from '../assets/songList.json';

export const useSongs = (favorites: string[], showFavorites: boolean) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 初始化加载歌曲和上次的搜索关键词
  useEffect(() => {
    // 加载歌曲数据
    setSongs(songListData);
    
    // 尝试从localStorage加载上次的搜索关键词
    try {
      const savedSearchQuery = localStorage.getItem('searchQuery');
      if (savedSearchQuery) {
        console.log('恢复上次的搜索关键词:', savedSearchQuery);
        setSearchQuery(savedSearchQuery);
      } else {
        // 如果没有保存的搜索关键词，则加载所有歌曲
        setFilteredSongs(songListData);
      }
    } catch (error) {
      console.error('加载搜索关键词失败:', error);
      setFilteredSongs(songListData);
    }
  }, []);

  // 保存搜索关键词到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('searchQuery', searchQuery);
      if (searchQuery) {
        console.log('保存搜索关键词:', searchQuery);
      }
    } catch (error) {
      console.error('保存搜索关键词失败:', error);
    }
  }, [searchQuery]);

  // 根据搜索和收藏过滤歌曲
  useEffect(() => {
    let filtered = songs;
    
    // 先过滤红心歌曲（如果需要）
    if (showFavorites) {
      filtered = filtered.filter(song => favorites.includes(song.bvid));
      console.log('过滤收藏歌曲，剩余:', filtered.length);
    }
    
    // 再根据搜索关键词过滤
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        song => 
          song.originalTitle.toLowerCase().includes(query) || 
          song.videoTitle.toLowerCase().includes(query) || 
          song.author.toLowerCase().includes(query) ||
          song.bvid.toLowerCase().includes(query)
      );
      console.log(`搜索"${query}"，匹配结果:`, filtered.length);
    }
    
    setFilteredSongs(filtered);
  }, [searchQuery, songs, showFavorites, favorites]);

  return {
    songs,
    filteredSongs,
    searchQuery,
    setSearchQuery
  };
}; 