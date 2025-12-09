// mobile-nav.html を読み込まず、ここに直接HTMLを持たせた「サーバー不要版」スクリプト
// Tailwindの読み込み待ちによるチラつき(FOUC)を防止する即時CSSを追加済み

document.addEventListener('DOMContentLoaded', () => {

    // 1. Tailwind CSSの自動注入
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        console.log("Tailwind CSS not found, injecting CDN...");
        const twScript = document.createElement('script');
        twScript.src = "https://cdn.tailwindcss.com";
        document.head.appendChild(twScript);
    }

    // 2. メニューのHTML構造
    // ★修正ポイント: <style>タグ内に、Tailwindを使わない「生のCSS」でレイアウトを定義。
    // これにより、Tailwindのロードを待たずに即座に正しい見た目になります。
    const menuHTML = `
    <style>
        /* 即時適用されるスタイル (Tailwind待ちの崩れ防止) */
        
        /* PC (1024px以上) では強制非表示 */
        @media (min-width: 992px) {
            .mobile-nav-root { display: none !important; }
        }

        /* スマホ用ボトムバーの基本スタイル */
        .mobile-nav-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 50;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.5rem;
            box-sizing: border-box;
        }

        /* アイコンボタンのリセット */
        .icon-btn {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
            width: auto !important;
            height: auto !important;
            cursor: pointer;
            color: #9ca3af; /* gray-400 */
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon-btn:hover { color: #ffffff; }

        /* オーバーレイメニューの初期状態（隠す） */
        .mobile-menu-overlay {
            position: fixed;
            inset: 0;
            z-index: 40;
            background-color: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(4px);
            transform: translateY(100%); /* 下に隠しておく */
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
        }
        
        /* クラス付与で表示 */
        .mobile-menu-overlay.open {
            transform: translateY(0);
        }

        /* 検索オーバーレイ */
        .search-overlay {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 60;
            background-color: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(12px);
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .search-overlay.active {
            display: flex;
            opacity: 1;
        }
    </style>

    <!-- ラッパー要素 (.mobile-nav-root) を追加してPCでの一括非表示を制御 -->
    <div class="mobile-nav-root">
        
        <!-- Bottom Bar (Fixed) -->
        <!-- Tailwindクラスも残しつつ、独自クラス(.mobile-nav-bar)で即時スタイル適用 -->
        <div class="mobile-nav-bar">
            <div class="flex items-center justify-between w-full">
                
                <!-- Logo -->
                <div class="font-serif text-xl font-bold tracking-wider text-white cursor-default">
                    Lounge.
                </div>

                <div class="flex items-center gap-6">
                    <button onclick="window.toggleSearch()" class="icon-btn" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    
                    <button id="menu-btn" onclick="window.toggleMenu()" class="icon-btn z-50" aria-label="Menu">
                        <div class="w-6 flex flex-col items-end gap-1.5 transition-all duration-300">
                            <span id="line1" class="block w-6 h-0.5 bg-current transition-all duration-300 origin-center"></span>
                            <span id="line2" class="block w-4 h-0.5 bg-current transition-all duration-300 origin-center"></span>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Menu Overlay -->
        <div id="mobile-menu" class="mobile-menu-overlay">
            <div class="flex-1 flex flex-col justify-center items-center pb-20 w-full overflow-y-auto">
                <div id="menu-container" class="w-full flex justify-center p-4">
                    <nav class="flex flex-col items-center gap-8 text-xl font-serif tracking-widest text-gray-400">
                        <a href="index.html" class="hover:text-white transition-colors">Home</a>
                        <a href="journal.html" class="hover:text-white transition-colors">Journal</a>
                        <a href="gallery.html" class="hover:text-white transition-colors">Gallery</a>
                        <a href="https://signal.me/#eu/m81TbpYpae9qUsL3SK2HkY9NnEzHpuBODVw3PZwdg4uHN1hupMpB4biJUwcuAI-f" target="_blank" class="hover:text-white transition-colors text-base opacity-80 mt-4">
                            Signal
                        </a>
                    </nav>
                </div>
                <div class="mt-12 pt-12 border-t border-white/10 w-40 text-center select-none">
                    <span id="clock-date" class="block text-xs text-gray-500 font-mono tracking-widest mb-1"></span>
                    <span id="clock-time" class="block text-sm text-gray-400 font-mono tracking-widest"></span>
                </div>
            </div>
        </div>

        <!-- Search Overlay -->
        <div id="search-overlay" class="search-overlay">
            <div class="w-full max-w-md">
                <form action="#" method="get" onsubmit="return false;">
                    <input type="text" name="q" placeholder="Search..." class="w-full bg-transparent border-b-2 border-white/30 text-2xl text-white py-2 focus:outline-none focus:border-white font-serif placeholder-gray-600 transition-colors">
                </form>
                <button onclick="window.toggleSearch()" class="mt-8 text-sm text-gray-500 uppercase tracking-widest hover:text-white w-full text-center icon-btn">Cancel</button>
            </div>
        </div>

    </div>
    `;

    const div = document.createElement('div');
    div.id = "mobile-nav-container";
    div.innerHTML = menuHTML;
    document.body.appendChild(div);

    window.toggleMenu = function() {
        const menu = document.getElementById('mobile-menu');
        const line1 = document.getElementById('line1');
        const line2 = document.getElementById('line2');
        
        // クラス操作で開閉 (Tailwindクラスへの依存を削除)
        const isOpen = menu.classList.contains('open');
        
        if (isOpen) {
            // 閉じる
            menu.classList.remove('open');
            line1.classList.remove('rotate-45', 'translate-y-2');
            line2.classList.remove('w-4'); // 長さを戻す
            line2.classList.add('w-4');    // 明示的に
            line2.classList.remove('w-6', '-rotate-45');
            document.body.style.overflow = ''; 
        } else {
            // 開く
            menu.classList.add('open');
            line1.classList.add('rotate-45', 'translate-y-2');
            line2.classList.remove('w-4');
            line2.classList.add('w-6', '-rotate-45'); 
            document.body.style.overflow = 'hidden'; 
        }
    };

    window.toggleSearch = function() {
        const search = document.getElementById('search-overlay');
        const isActive = search.classList.contains('active');
        
        if (isActive) {
            // 閉じる
            search.classList.remove('active');
            setTimeout(() => { search.style.display = 'none'; }, 300);
        } else {
            // 開く
            search.style.display = 'flex';
            // 少し待ってからopacityを1にしてフェードインさせる
            setTimeout(() => { search.classList.add('active'); }, 10);
            const input = document.querySelector('#search-overlay input');
            if(input) input.focus();
        }
    };

    function updateClock() {
        const now = new Date();
        const dateStr = now.getFullYear() + '.' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '.' + 
                        String(now.getDate()).padStart(2, '0');
        const timeStr = String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0') + ':' + 
                        String(now.getSeconds()).padStart(2, '0');
        
        const elDate = document.getElementById('clock-date');
        const elTime = document.getElementById('clock-time');
        if(elDate) elDate.textContent = dateStr;
        if(elTime) elTime.textContent = timeStr;
    }
    
    updateClock();
    setInterval(updateClock, 1000);

    console.log("Mobile Nav loaded successfully (Anti-FOUC Mode).");
});