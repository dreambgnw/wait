// ロゴをリンクではなく「置物」に変更したバージョン

document.addEventListener('DOMContentLoaded', () => {
    
    const layout = document.querySelector('.split-layout, .main-container');
    if (!layout) return;

    const sidebarHTML = `
    <div class="text-area">
        <div>
            <!-- ロゴ (リンク削除 / 置物化) -->
            <header>
                <!-- cursor-default で「クリックできない」ことを明示 -->
                <div class="site-logo" style="cursor: default;">Lounge.</div>
            </header>

            <!-- メインナビ -->
            <nav>
                <ul class="nav-links">
                    <!-- Homeが唯一の戻る手段 -->
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

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sidebarHTML;
    
    const sidebar = tempDiv.querySelector('.text-area');
    if (sidebar) {
        layout.prepend(sidebar);
        initActiveLink();
        startSidebarClock();
    }
});

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