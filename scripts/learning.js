// 学习路径页面交互脚本

// 侧边栏导航交互
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const submenuLinks = document.querySelectorAll('.nav-submenu a');
    const chapterContents = document.querySelectorAll('.chapter-content');
    const sidebar = document.querySelector('.sidebar');

    // 创建移动端侧边栏切换按钮
    if (window.innerWidth <= 768) {
        const sidebarToggle = document.createElement('button');
        sidebarToggle.innerHTML = '☰ 目录';
        sidebarToggle.className = 'sidebar-toggle';
        sidebarToggle.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            padding: 0.8rem 1.5rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(sidebarToggle);

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarToggle.innerHTML = sidebar.classList.contains('active') ? '✕ 关闭' : '☰ 目录';
        });

        // 点击内容区域关闭侧边栏
        document.querySelector('.content-area').addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                sidebarToggle.innerHTML = '☰ 目录';
            }
        });
    }

    // 点击主导航项 - 切换章节内容
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const navSection = this.closest('.nav-section');
            const isActive = this.classList.contains('active');
            
            // 移除所有active类
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.nav-section').forEach(section => section.classList.remove('active'));
            
            // 切换当前项的active状态
            if (!isActive) {
                this.classList.add('active');
                navSection.classList.add('active');
            }
            
            // 切换章节内容
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 隐藏所有章节
                chapterContents.forEach(chapter => {
                    chapter.classList.remove('active');
                });
                
                // 显示目标章节
                targetElement.classList.add('active');
                
                // 滚动到内容区域顶部
                const contentContainer = document.querySelector('.content-container');
                if (contentContainer) {
                    contentContainer.scrollTop = 0;
                }
            }

            // 移动端关闭侧边栏
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
                const toggle = document.querySelector('.sidebar-toggle');
                if (toggle) toggle.innerHTML = '☰ 目录';
            }
        });
    });

    // 点击子菜单链接 - 切换对应小节内容
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 确保章节是显示的
                const chapter = targetElement.closest('.chapter-content');
                if (chapter) {
                    chapterContents.forEach(ch => ch.classList.remove('active'));
                    chapter.classList.add('active');
                    
                    // 隐藏当前章节的所有小节
                    const sections = chapter.querySelectorAll('.section');
                    sections.forEach(section => section.classList.remove('active'));
                    
                    // 显示目标小节
                    targetElement.classList.add('active');
                    
                    // 滚动到内容区域顶部
                    const contentContainer = document.querySelector('.content-container');
                    if (contentContainer) {
                        contentContainer.scrollTop = 0;
                    }
                }
            }

            // 移动端关闭侧边栏
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
                const toggle = document.querySelector('.sidebar-toggle');
                if (toggle) toggle.innerHTML = '☰ 目录';
            }
        });
    });

    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            // 搜索所有章节和小节
            const allSections = document.querySelectorAll('.section');
            allSections.forEach(section => {
                const text = section.textContent.toLowerCase();
                if (searchTerm === '') {
                    // 清空搜索时，恢复默认显示（只显示每个章节的第一个小节）
                    const chapter = section.closest('.chapter-content');
                    const sectionsInChapter = chapter.querySelectorAll('.section');
                    sectionsInChapter.forEach((s, index) => {
                        if (index === 0) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                } else if (text.includes(searchTerm)) {
                    // 搜索匹配时，显示该小节
                    section.classList.add('active');
                } else {
                    // 不匹配时，隐藏该小节
                    section.classList.remove('active');
                }
            });
        });
    }

    // 代码块复制功能
    const codeBlocks = document.querySelectorAll('.code-block pre');
    codeBlocks.forEach(block => {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制';
        copyButton.className = 'copy-btn';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 0.4rem 1rem;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // 将pre元素设置为相对定位
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(copyButton);

        // 鼠标悬停时显示按钮
        block.parentElement.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });

        block.parentElement.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });

        // 点击复制
        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = '已复制!';
                setTimeout(() => {
                    copyButton.textContent = '复制';
                }, 2000);
            });
        });
    });

    // 添加进度指示器
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 280px;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        transform-origin: left;
        transform: scaleX(0);
        z-index: 1000;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // 监听内容容器滚动
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
        contentContainer.addEventListener('scroll', () => {
            const scrollHeight = contentContainer.scrollHeight - contentContainer.clientHeight;
            const scrolled = contentContainer.scrollTop / scrollHeight;
            progressBar.style.transform = `scaleX(${scrolled})`;
        });
    }
});
