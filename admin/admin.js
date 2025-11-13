// 环境感知的 API URL
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// 富文本编辑器实例
let quillEditor;
let quillEditEditor;

// 页面加载时获取所有文章
document.addEventListener('DOMContentLoaded', () => {
    initQuillEditors();
    loadArticles();
    setupFormHandlers();
});

// 初始化 Quill 富文本编辑器
function initQuillEditors() {
    // 添加文章的编辑器
    quillEditor = new Quill('#editor', {
        theme: 'snow',
        placeholder: '在这里输入文章内容，支持富文本格式...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    // 编辑文章的编辑器
    quillEditEditor = new Quill('#editEditor', {
        theme: 'snow',
        placeholder: '在这里输入文章内容，支持富文本格式...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
}

// 设置表单处理器
function setupFormHandlers() {
    const form = document.getElementById('articleForm');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');

    // 图片预览 - 添加表单
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 图片预览 - 编辑表单
    const editImageInput = document.getElementById('editImage');
    const editImagePreview = document.getElementById('editImagePreview');
    editImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                editImagePreview.src = e.target.result;
                editImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 添加表单提交
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await addArticle();
    });

    // 编辑表单提交
    const editForm = document.getElementById('editArticleForm');
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateArticle();
    });
}

// 加载所有文章
async function loadArticles() {
    try {
        const response = await fetch(`${API_URL}/articles`);
        if (!response.ok) throw new Error('Failed to fetch articles');

        const articles = await response.json();
        displayArticles(articles);
        updateArticleCount(articles.length);
    } catch (error) {
        console.error('Error loading articles:', error);
        showError('加载文章失败，请确保服务器正在运行');
    }
}

// 显示文章列表
function displayArticles(articles) {
    const articleList = document.getElementById('articleList');

    if (articles.length === 0) {
        articleList.innerHTML = `
            <div class="empty-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p>还没有文章，开始添加第一篇吧！</p>
            </div>
        `;
        return;
    }

    articleList.innerHTML = articles.map(article => `
        <div class="article-item">
            ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-image">` : ''}
            <div class="article-header">
                <div class="article-title">${escapeHtml(article.title)}</div>
                <div class="article-actions">
                    <button class="btn btn-info" onclick='viewArticle(${JSON.stringify(article).replace(/'/g, "&apos;")})'>查看</button>
                    <button class="btn btn-success" onclick='editArticle(${JSON.stringify(article).replace(/'/g, "&apos;")})'>编辑</button>
                    <button class="btn btn-danger" onclick="deleteArticle('${article.id}')">删除</button>
                </div>
            </div>
            <div class="article-meta">
                作者：${escapeHtml(article.author)} |
                发布时间：${formatDate(article.date)}
            </div>
            <div class="article-summary">${escapeHtml(article.summary)}</div>
        </div>
    `).join('');
}

// 添加文章
async function addArticle() {
    const form = document.getElementById('articleForm');
    const formData = new FormData(form);

    // 获取富文本内容（HTML格式）
    const htmlContent = quillEditor.root.innerHTML;
    formData.set('content', htmlContent);

    try {
        const response = await fetch(`${API_URL}/articles`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add article');
        }

        const result = await response.json();
        showSuccess('文章发布成功！');
        form.reset();
        quillEditor.setContents([]); // 清空富文本编辑器
        document.getElementById('imagePreview').style.display = 'none';
        loadArticles(); // 重新加载文章列表
    } catch (error) {
        console.error('Error adding article:', error);
        showError('发布文章失败：' + error.message);
    }
}

// 删除文章
async function deleteArticle(id) {
    if (!confirm('确定要删除这篇文章吗？')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/articles/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete article');
        }

        showSuccess('文章已删除！');
        loadArticles(); // 重新加载文章列表
    } catch (error) {
        console.error('Error deleting article:', error);
        showError('删除文章失败：' + error.message);
    }
}

// 更新文章计数
function updateArticleCount(count) {
    document.getElementById('articleCount').textContent = count;
}

// 显示成功消息
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';

    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// 显示错误消息
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// HTML转义（防止XSS）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 查看文章
function viewArticle(article) {
    const modal = document.getElementById('viewModal');
    const viewContent = document.getElementById('viewContent');

    // 将文章内容转换为HTML（简单的换行处理）
    const contentHtml = article.content
        .split('\n')
        .map(para => para.trim())
        .filter(para => para.length > 0)
        .map(para => `<p>${escapeHtml(para)}</p>`)
        .join('');

    viewContent.innerHTML = `
        ${article.image ? `<img src="${article.image}" alt="${escapeHtml(article.title)}" style="max-width: 100%; border-radius: 10px; margin-bottom: 1.5rem;">` : ''}
        <h1 style="color: #667eea; margin-bottom: 0.5rem;">${escapeHtml(article.title)}</h1>
        <p style="color: #888; font-size: 0.9rem; margin-bottom: 2rem;">
            作者：${escapeHtml(article.author)} | 发布时间：${formatDate(article.date)}
        </p>
        <div style="line-height: 1.8;">
            ${contentHtml}
        </div>
    `;

    modal.classList.add('active');
}

// 关闭查看模态窗口
function closeViewModal() {
    const modal = document.getElementById('viewModal');
    modal.classList.remove('active');
}

// 编辑文章
function editArticle(article) {
    const modal = document.getElementById('editModal');

    // 填充表单数据
    document.getElementById('editArticleId').value = article.id;
    document.getElementById('editTitle').value = article.title;
    document.getElementById('editSummary').value = article.summary;

    // 设置富文本编辑器内容
    quillEditEditor.root.innerHTML = article.content;

    document.getElementById('editAuthor').value = article.author;
    document.getElementById('editImageWidth').value = article.imageWidth || '';
    document.getElementById('editImageHeight').value = article.imageHeight || '';

    // 显示当前图片
    if (article.image) {
        const editImagePreview = document.getElementById('editImagePreview');
        editImagePreview.src = article.image;
        editImagePreview.style.display = 'block';
    }

    modal.classList.add('active');
}

// 关闭编辑模态窗口
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('active');
    document.getElementById('editArticleForm').reset();
    quillEditEditor.setContents([]); // 清空富文本编辑器
    document.getElementById('editImagePreview').style.display = 'none';
}

// 更新文章
async function updateArticle() {
    const id = document.getElementById('editArticleId').value;
    const form = document.getElementById('editArticleForm');
    const formData = new FormData(form);

    // 获取富文本内容（HTML格式）
    const htmlContent = quillEditEditor.root.innerHTML;
    formData.set('content', htmlContent);

    try {
        const response = await fetch(`${API_URL}/articles/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update article');
        }

        const result = await response.json();
        showSuccess('文章更新成功！');
        closeEditModal();
        loadArticles(); // 重新加载文章列表
    } catch (error) {
        console.error('Error updating article:', error);
        showError('更新文章失败：' + error.message);
    }
}

// 点击模态窗口外部关闭
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const viewModal = document.getElementById('viewModal');

    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === viewModal) {
        closeViewModal();
    }
}
