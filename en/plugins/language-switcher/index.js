module.exports = {
    hooks: {
        'page:before': function(page) {
            // 添加语言切换按钮到页面
            const languageSwitcher = `
<div class="language-switcher">
    <a href="../zh/" class="zh-link">🇨🇳 中文</a>
    <a href="../en/" class="en-link">🇺🇸 English</a>
</div>

<script>
// 语言切换按钮逻辑
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
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
});
</script>
`;
            
            // 将语言切换器添加到页面内容
            page.content = languageSwitcher + page.content;
            return page;
        }
    }
};
