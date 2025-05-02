import './App.css'
import MusicPlayer from './components/MusicPlayer'

function App() {
  return (
    <div className="app-container">
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
