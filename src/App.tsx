import { useEffect } from 'react'
import './App.css'
import MusicPlayer from './components/MusicPlayer'

function App() {
  // 确保localStorage在应用加载时能被正确访问
  useEffect(() => {
    // 验证localStorage是否可以正常工作
    try {
      // 测试保存和读取
      localStorage.setItem('app_initialized', 'true');
      const testValue = localStorage.getItem('app_initialized');
      console.log('App初始化时检查localStorage可用性:', testValue === 'true');
      
      // 验证已保存的设置
      const savedTheme = localStorage.getItem('theme');
      const savedPlayMode = localStorage.getItem('playMode');
      const savedAutoPlay = localStorage.getItem('autoPlay');
      const savedFavorites = localStorage.getItem('favorites');
      
      console.log('App初始化检查已保存设置:', {
        theme: savedTheme,
        playMode: savedPlayMode,
        autoPlay: savedAutoPlay,
        hasFavorites: !!savedFavorites
      });
    } catch (error) {
      console.error('localStorage访问失败:', error);
    }
  }, []);
  
  return (
    <div className="app-container" style={{ width: '100vw', minHeight: '100vh' }}>
      <header>
        <h1>哔哩哔哩音乐播放器</h1>
        <p>点击歌曲播放音频</p>
      </header>
      
      <main>
        <MusicPlayer />
      </main>
      
      <footer>
        <p>注意：此应用仅作为演示，不提供实际的音频播放功能</p>
      </footer>
    </div>
  )
}

export default App
