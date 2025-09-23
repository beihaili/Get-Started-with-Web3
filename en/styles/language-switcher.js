// 语言切换器脚本
(function() {
    'use strict';
    
    // 等待页面加载完成
    function initLanguageSwitcher() {
        // 检查是否已经存在语言切换器
        if (document.querySelector('.language-switcher')) {
            return;
        }
        
        // 获取当前路径
        const currentPath = window.location.pathname;
        
        // 创建语言切换器HTML
        const switcherHTML = `
            <div class="language-switcher">
                <a href="../zh/" class="zh-link">🇨🇳 中文</a>
                <a href="../en/" class="en-link">🇺🇸 English</a>
            </div>
        `;
        
        // 插入到页面
        document.body.insertAdjacentHTML('beforeend', switcherHTML);
        
        // 获取按钮元素
        const zhLink = document.querySelector('.zh-link');
        const enLink = document.querySelector('.en-link');
        
        // 根据当前路径设置活动状态
        if (currentPath.includes('/zh/')) {
            zhLink.classList.add('active');
        } else if (currentPath.includes('/en/')) {
            enLink.classList.add('active');
        }
        
        // 添加点击事件
        zhLink.addEventListener('click', function(e) {
            localStorage.setItem('preferredLanguage', 'zh');
        });
        
        enLink.addEventListener('click', function(e) {
            localStorage.setItem('preferredLanguage', 'en');
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
    } else {
        initLanguageSwitcher();
    }
})();
