#!/bin/bash

# 后处理脚本：在HonKit构建完成后注入JavaScript代码

echo "🔧 注入语言切换和浏览量统计功能..."

# 查找所有HTML文件并注入JavaScript
find . -name "*.html" -type f | while read file; do
    echo "处理文件: $file"
    
    # 在</body>标签前注入JavaScript
    sed -i.bak 's|</body>|<script src="../js/common.js"></script></body>|g' "$file"
    
    # 删除备份文件
    rm -f "$file.bak"
done

echo "✅ JavaScript注入完成！"
