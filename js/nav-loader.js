// スマホメニューもロゴを「置物」化

document.addEventListener('DOMContentLoaded', () => {

    if (!document.querySelector('script[src*="tailwindcss"]')) {
        console.log("Tailwind CSS not found, injecting CDN...");
        const twScript = document.createElement('script');
        twScript.src = "https://cdn.tailwindcss.com";
        document.head.appendChild(twScript);
    }

    const menuHTML = `
    <style>
        @media (min-width: 1024px) {
            .lg\\:hidden { display: none !important; }
        }
    </style>

    <!-- Bottom Bar (Fixed) -->
    <div class="lg:hidden fixed bottom-0 left-0 w-full z-50 border-t border-white/10 bg-black/80 backdrop-blur-md">
        <div class="flex items-center justify-between px-6 py-4">
            
            <!-- Logo (リンク削除 / 置物化) -->
            <!-- cursor-default を適用 -->
            <div class="font-serif text-xl font-bold tracking-wider text-white cursor-default">
                Lounge.
            </div>

            <div class="flex items-center gap-6">
                <button onclick="window.toggleSearch()" class="text-gray-400 hover:text-white transition-colors" aria-label="Search">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <button id="menu-btn" onclick="window.toggleMenu()" class="text-gray-400 hover:text-white transition-colors w-6 h-6 relative flex justify-center items-center z-50" aria-label="Menu">
                    <div class="w-6 flex flex-col items-end gap-1.5 transition-all duration-300">
                        <span id="line1" class="block w-6 h-0.5 bg-current transition-all duration-300 origin-center"></span>
                        <span id="line2" class="block w-4 h-0.5 bg-current transition-all duration-300 origin-center"></span>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <!-- Menu Overlay -->
    <div id="mobile-menu" class="lg:hidden fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col">
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
    <div id="search-overlay" class="lg:hidden fixed inset-0 z-[60] bg-black/95 hidden flex items-center justify-center p-6 backdrop-blur-md opacity-0 transition-opacity duration-300">
        <div class="w-full max-w-md">
            <form action="#" method="get" onsubmit="return false;">
                <input type="text" name="q" placeholder="Search..." class="w-full bg-transparent border-b-2 border-white/30 text-2xl text-white py-2 focus:outline-none focus:border-white font-serif placeholder-gray-600 transition-colors">
            </form>
            <button onclick="window.toggleSearch()" class="mt-8 text-sm text-gray-500 uppercase tracking-widest hover:text-white w-full text-center">Cancel</button>
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
        
        const isClosed = menu.classList.contains('translate-y-full');
        
        if (isClosed) {
            menu.classList.remove('translate-y-full');
            line1.classList.add('rotate-45', 'translate-y-2');
            line2.classList.remove('w-4');
            line2.classList.add('w-6', '-rotate-45'); 
            document.body.style.overflow = 'hidden'; 
        } else {
            menu.classList.add('translate-y-full');
            line1.classList.remove('rotate-45', 'translate-y-2');
            line2.classList.add('w-4');
            line2.classList.remove('w-6', '-rotate-45');
            document.body.style.overflow = ''; 
        }
    };

    window.toggleSearch = function() {
        const search = document.getElementById('search-overlay');
        const isHidden = search.classList.contains('hidden');
        
        if (isHidden) {
            search.classList.remove('hidden');
            setTimeout(() => { search.classList.remove('opacity-0'); }, 10);
            document.querySelector('#search-overlay input').focus();
        } else {
            search.classList.add('opacity-0');
            setTimeout(() => { search.classList.add('hidden'); }, 300);
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

    console.log("Mobile Nav loaded successfully (Logo is non-clickable).");
});