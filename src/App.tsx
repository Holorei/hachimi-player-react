import { useEffect } from 'react'
import './App.css'
import MusicPlayer from './components/MusicPlayer'
import InfoModal from './components/InfoModal'
import './styles/InfoModal.css'
import githubIcon from './assets/github.svg'

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
        <div className="nav-container">
          <h1>哈基米音乐播放器</h1>
          <nav className="top-nav">
            <a href="https://github.com/holorei/hachimi-player-react" target="_blank" rel="noopener noreferrer" className="github-icon">
              <img src={githubIcon} alt="GitHub" />
            </a>
            <a href="#about" className="nav-link">关于</a>
            <a href="#license" className="nav-link">许可</a>
          </nav>
        </div>
      </header>
      
      <main>
        <MusicPlayer />
      </main>
      
      <footer>
        <div className="footer-links">
          <a href="#privacy-policy" className="footer-link">隐私政策</a>
        </div>
      </footer>

      <InfoModal />
    </div>
  )
}

export default App
