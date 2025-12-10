// サイドバーのHTMLを生成・挿入するスクリプト
// 2カラムレイアウトの左側に固定表示されます。

document.addEventListener('DOMContentLoaded', () => {
    
    // 挿入先のコンテナを探す (.split-layout または .main-container)
    const layout = document.querySelector('.split-layout, .main-container');
    if (!layout) return;

    // シンプルなサイドバー構造
    const sidebarHTML = `
    <div class="text-area">
        <div>
            <header>
                <div class="site-logo" style="cursor: default;">Lounge.</div>
            </header>

            <nav>
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="journal.html">Journal</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                </ul>

                <ul class="sub-links">
                    <li><a href="https://signal.me/#eu/m81TbpYpae9qUsL3SK2HkY9NnEzHpuBODVw3PZwdg4uHN1hupMpB4biJUwcuAI-f" target="_blank">Signal</a></li>
                </ul>
            </nav>
        </div>

        <div class="clock-area">
            <span id="sidebar-date"></span>
            <span id="sidebar-time"></span>
        </div>
    </div>
    `;

    // HTMLをDOM化して挿入
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sidebarHTML;
    
    const sidebar = tempDiv.querySelector('.text-area');
    if (sidebar) {
        // コンテナの先頭(左側)に追加
        layout.prepend(sidebar);
        
        initActiveLink();
        startSidebarClock();
    }
});

function initActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    // DOM挿入直後のため念のため少し待つ
    setTimeout(() => {
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }, 50);
}

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