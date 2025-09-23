module.exports = {
    hooks: {
        "page:before": function(page) {
            // 在页面内容前添加我们的脚本
            const scriptTag = `
                <script src="../js/common.js"></script>
            `;
            
            page.content = scriptTag + page.content;
            return page;
        }
    }
};
