// サイドバー(sidebar.html)を読み込んで表示し、機能させるスクリプト

document.addEventListener('DOMContentLoaded', () => {
    
    // 挿入先のコンテナを探す (.split-layout がある前提)
    const layout = document.querySelector('.split-layout');
    if (!layout) return;

    // キャッシュ回避用
    const v = new Date().getTime();

    fetch(`sidebar.html?v=${v}`)
        .then(res => {
            if (!res.ok) throw new Error('Sidebar load failed');
            return res.text();
        })
        .then(html => {
            // HTMLをDOM化
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // sidebar.html内の .text-area を取り出す
            const sidebar = tempDiv.querySelector('.text-area');
            if (sidebar) {
                // レイアウトの先頭(左側)に挿入
                layout.prepend(sidebar);
                
                // 初期化処理
                initActiveLink();
                startSidebarClock();
            }
        })
        .catch(err => console.error(err));
});

// 現在のページのリンクをハイライトする
function initActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        // hrefが現在のファイル名を含んでいれば active
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