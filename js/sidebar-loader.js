// サイドバーのHTMLをJS内に埋め込んだ「サーバー不要版」
// index.html の構造 (.text-area) をそのまま流用しています。

document.addEventListener('DOMContentLoaded', () => {
    
    // 挿入先のコンテナを探す (.split-layout がある前提)
    const layout = document.querySelector('.split-layout');
    if (!layout) return;

    // 埋め込み用サイドバーHTML (index.htmlのデザインを完全再現)
    const sidebarHTML = `
    <div class="text-area">
        <div>
            <!-- ロゴ -->
            <header>
                <!-- index.htmlではdivでしたが、戻れるようにaタグにしています。見た目は同じです -->
                <a href="index.html" class="site-logo">Lounge.</a>
            </header>

            <!-- メインナビ -->
            <nav>
                <ul class="nav-links">
                    <!-- 下層ページなのでHomeを追加 -->
                    <li><a href="index.html">Home</a></li>
                    <li><a href="journal.html">Journal</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                </ul>

                <!-- サブナビ -->
                <ul class="sub-links">
                    <li><a href="https://signal.me/#eu/m81TbpYpae9qUsL3SK2HkY9NnEzHpuBODVw3PZwdg4uHN1hupMpB4biJUwcuAI-f" target="_blank">Signal</a></li>
                </ul>
            </nav>
        </div>

        <!-- 待合室の時計 (IDはJS制御用に sidebar- を付与していますが、クラス構成は同じです) -->
        <div class="clock-area">
            <span id="sidebar-date"></span>
            <span id="sidebar-time"></span>
        </div>
    </div>
    `;

    // HTMLをDOM化して挿入
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sidebarHTML;
    
    // .text-area を取り出してレイアウトの先頭に追加
    const sidebar = tempDiv.querySelector('.text-area');
    if (sidebar) {
        layout.prepend(sidebar);
        
        // 初期化処理
        initActiveLink();
        startSidebarClock();
    }
});

// 現在のページのリンクをハイライトする
function initActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// サイドバーの時計を動かす
function startSidebarClock() {
    function update() {
        const now = new Date();
        const dateStr = now.getFullYear() + '.' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '.' + 
                        String(now.getDate()).padStart(2, '0');
        const timeStr = String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0') + ':' + 
                        String(now.getSeconds()).padStart(2, '0');
        
        const elDate = document.getElementById('sidebar-date');
        const elTime = document.getElementById('sidebar-time');
        if(elDate) elDate.textContent = dateStr;
        if(elTime) elTime.textContent = timeStr;
    }
    update();
    setInterval(update, 1000);
}