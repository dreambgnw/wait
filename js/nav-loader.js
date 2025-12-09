// mobile-nav.html を読み込んでページに挿入するスクリプト
document.addEventListener('DOMContentLoaded', () => {
    // キャッシュ対策（開発中は ?v=... をつけると反映が早い）
    fetch('mobile-nav.html?v=' + new Date().getTime())
        .then(response => {
            if (!response.ok) throw new Error("Nav load failed");
            return response.text();
        })
        .then(html => {
            // HTMLファイルから <!-- ▼ Mobile Nav ... --> の範囲だけを抽出
            // (html/head/bodyタグなどが重複しないようにするため)
            const match = html.match(/<!-- ▼ Mobile Nav Component Start.*▼ -->([\s\S]*?)<!-- ▲ Mobile Nav Component End ▲ -->/);
            const content = match ? match[1] : html;
            
            // コンテナを作成してHTMLを流し込む
            const div = document.createElement('div');
            div.id = "mobile-nav-container";
            div.innerHTML = content;
            document.body.appendChild(div);

            // ⚠️ innerHTMLで追加した <script> は自動実行されないため、
            // 手動で作り直して再実行させる処理
            div.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                // src属性や中身をコピー
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        })
        .catch(err => console.error('Error loading mobile-nav:', err));
});