import { useState, useEffect } from 'react';

type ModalType = 'about' | 'license' | 'privacy-policy' | null;

const InfoModal = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['about', 'license', 'privacy-policy'].includes(hash)) {
        setActiveModal(hash as ModalType);
      } else {
        setActiveModal(null);
      }
    };

    // 初始检查
    handleHashChange();

    // 监听hash变化
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const closeModal = () => {
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
    setActiveModal(null);
  };

  if (!activeModal) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>×</button>
        
        {activeModal === 'about' && (
          <div className="modal-section">
            <h2>关于</h2>
            <p>"哈基米"，最初是日语中"蜂蜜"（ハチミツ）的空耳表达，因赛马娘二创音乐《馬鹿ふたり》的流行而逐渐走红网络。在短视频平台的广泛使用中，它逐渐演化为一种对"可爱、软萌事物"的拟声/代称，也成为了某类 AI 二创音效的代表模因，形成了独特的抽象二次元网络文化现象。</p>
            <p>本项目整理和收录目前在 Bilibili 平台上较具人气的"哈基米/曼波"音乐。播放器界面简洁直观，支持顺序播放、随机播放、单曲循环等基础功能，并配有喜欢音乐列表的创建、导入、导出等功能。</p>
            <p>音乐播放使用 Bilibili 官方嵌入播放器，确保内容来源正规，避免版权风险。所有音乐内容均指向原视频页面，并附带原作者信息。</p>
            <p>本站播放列表将不定期更新，如有想要收录的歌曲，可以发送到anemone159dev@gmail.com。</p>
          </div>
        )}

        {activeModal === 'license' && (
          <div className="modal-section">
            <h2>使用授权声明</h2>
            <p>本网站仅作为非商业性质的个人作品展示平台，内容聚合自公开可访问的第三方平台（Bilibili），用于分享哈基米风格音乐及相关创作。</p>
            <ol>
              <li><strong>视频与音频内容</strong><br />本网站中的所有音频与视频内容均通过 Bilibili 官方播放器进行嵌入播放，不直接托管任何第三方内容文件。所有内容的著作权归原作者与平台所有。</li>
              <li><strong>使用范围</strong><br />本站不拥有上述嵌入内容的版权，仅做公开展示用途。如原作者不同意展示，欢迎通过邮箱联系，我将及时移除相关内容。</li>
              <li><strong>播放器功能</strong><br />本网站提供的播放器功能（如随机播放、播放列表创建等）仅限用户本地浏览器内使用，不涉及内容下载或分发，符合合理使用范围。</li>
              <li><strong>联系</strong><br />如您是内容原创者并希望移除本站中任何嵌入内容，或希望进行署名修正，请联系邮箱：<br />📧 anemone159dev@gmail.com</li>
            </ol>
          </div>
        )}

        {activeModal === 'privacy-policy' && (
          <div className="modal-section">
            <h2>隐私政策</h2>
            <p>本网站为个人项目，旨在整理与分享哈基米音乐相关内容，不涉及任何用户个人信息的收集或处理。</p>
            <ol>
              <li><strong>信息收集与使用</strong><br />本网站不会主动收集或存储任何用户的个人信息。所有功能（如音乐播放、播放列表创建）均无需登录或提供身份信息。</li>
              <li><strong>Cookie 与第三方内容</strong><br />本站自身不使用 Cookie 技术，但嵌入的第三方服务（如 Bilibili 播放器）可能使用 Cookie 或其他追踪方式，以实现功能或收集匿名使用数据。请参考 Bilibili 的相关政策了解更多信息。</li>
              <li><strong>广告服务（如适用）</strong><br />若未来启用 Google AdSense 或其他广告服务，这些服务提供方可能会使用 Cookie 或相关技术为您展示个性化广告。用户可访问相关平台管理广告偏好设置。</li>
              <li><strong>外部链接</strong><br />本站可能包含指向其他网站的视频或资源链接，这些站点可能有独立的隐私政策。我们对这些第三方网站的内容或行为不承担任何责任。</li>
              <li><strong>联系方式</strong><br />若您对本隐私政策有疑问或需进一步了解网站的使用条款，请通过以下邮箱与我联系：<br />📧 anemone159dev@gmail.com</li>
            </ol>
            <p>本政策可能不定期更新，更新内容将会在本页面发布。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoModal; 