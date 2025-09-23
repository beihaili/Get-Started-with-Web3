// 通用语言切换和页面浏览量统计脚本
(function() {
    'use strict';
    
    // 页面浏览量统计
    function updatePageViews() {
        const pageKey = 'web3_tutorial_views_' + window.location.pathname;
        let views = parseInt(localStorage.getItem(pageKey)) || 0;
        views++;
        localStorage.setItem(pageKey, views.toString());
        
        // 显示浏览量
        const viewsElement = document.getElementById('pageViews');
        if (viewsElement) {
            viewsElement.textContent = views.toLocaleString();
        }
        
        return views;
    }
    
    // 创建语言切换按钮
    function createLanguageSwitch() {
        const currentPath = window.location.pathname;
        const isZh = currentPath.includes('/zh/');
        const isEn = currentPath.includes('/en/');
        
        if (!isZh && !isEn) return; // 只在语言页面显示切换按钮
        
        const switchButton = document.createElement('div');
        switchButton.id = 'languageSwitch';
        switchButton.innerHTML = `
            <button onclick="switchLanguage()" class="lang-switch-btn">
                ${isZh ? '🇺🇸 English' : '🇨🇳 中文'}
            </button>
        `;
        
        // 添加到页面
        const body = document.body;
        if (body) {
            body.appendChild(switchButton);
        }
    }
    
    // 语言切换函数
    window.switchLanguage = function() {
        const currentPath = window.location.pathname;
        const isZh = currentPath.includes('/zh/');
        
        if (isZh) {
            // 从中文切换到英文
            const enPath = currentPath.replace('/zh/', '/en/');
            window.location.href = enPath;
        } else {
            // 从英文切换到中文
            const zhPath = currentPath.replace('/en/', '/zh/');
            window.location.href = zhPath;
        }
    };
    
    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #languageSwitch {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .lang-switch-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 25px;
                padding: 8px 16px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .lang-switch-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .page-views-counter {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // 创建页面浏览量显示
    function createPageViewsCounter() {
        const counter = document.createElement('div');
        counter.className = 'page-views-counter';
        counter.innerHTML = '👁️ <span id="pageViews">-</span> 次浏览';
        document.body.appendChild(counter);
    }
    
    // 初始化
    function init() {
        addStyles();
        createLanguageSwitch();
        createPageViewsCounter();
        updatePageViews();
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
