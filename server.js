const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 文章详情页模板路径
const ARTICLE_TEMPLATE_PATH = path.join(__dirname, 'pages', 'article-detail.html');
const ARTICLES_DIR = path.join(__dirname, 'pages', 'articles');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 提供静态文件服务

// Multer 配置改为内存存储（用于上传到 Supabase）
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 限制
  }
});

// 确保文章目录存在（用于生成静态HTML）
async function ensureArticlesDir() {
  try {
    await fs.mkdir(ARTICLES_DIR, { recursive: true });
  } catch (error) {
    console.error('Error ensuring articles directory:', error);
  }
}

// 生成文章详情页HTML
async function generateArticleDetailPage(article) {
  try {
    // 读取模板
    const template = await fs.readFile(ARTICLE_TEMPLATE_PATH, 'utf8');

    // 格式化日期
    const date = new Date(article.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 处理图片HTML
    const imageHtml = article.image
      ? `<img src="${article.image}" alt="${article.title}" class="article-image">`
      : '';

    // 替换模板中的占位符
    let html = template
      .replace(/{ARTICLE_TITLE}/g, article.title)
      .replace(/{ARTICLE_AUTHOR}/g, article.author)
      .replace(/{ARTICLE_DATE}/g, formattedDate)
      .replace(/{ARTICLE_IMAGE}/g, imageHtml)
      .replace(/{ARTICLE_CONTENT}/g, article.content);

    // 生成文件名（使用文章ID）
    const fileName = `article-${article.id}.html`;
    const filePath = path.join(ARTICLES_DIR, fileName);

    // 写入文件
    await fs.writeFile(filePath, html, 'utf8');

    // 返回文章详情页URL
    return `/pages/articles/${fileName}`;
  } catch (error) {
    console.error('Error generating article detail page:', error);
    return null;
  }
}

// 从 Supabase 读取文章
async function readArticles() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

// API路由

// 获取所有文章
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await readArticles();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// 获取最新3篇文章
app.get('/api/articles/latest', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false })
      .limit(3);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    res.status(500).json({ error: 'Failed to fetch latest articles' });
  }
});

// 添加新文章
app.post('/api/articles', upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content, author } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ error: 'Title, summary, and content are required' });
    }

    let imageUrl = '/images/design/hero-main.png';

    // 如果有上传图片，保存到 Supabase Storage
    if (req.file) {
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('yuanyue')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('yuanyue')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    const articleId = Date.now().toString();
    const newArticle = {
      id: articleId,
      title,
      summary,
      content,
      author: author || 'Admin',
      date: new Date().toISOString(),
      image: imageUrl
    };

    // 生成动态文章详情页URL (不再生成静态文件)
    const detailPageUrl = `/pages/article.html?id=${articleId}`;

    // 保存到 Supabase (包含 detailPageUrl)
    newArticle.detailPageUrl = detailPageUrl;

    const { data: insertedData, error: insertError } = await supabase
      .from('articles')
      .insert([newArticle])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({ message: 'Article created successfully', article: insertedData });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// 获取单篇文章
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// 删除文章
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// 更新文章
app.put('/api/articles/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content, author } = req.body;

    // 获取现有文章
    const { data: existingArticle, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    let imageUrl = existingArticle.image;

    // 如果有上传新图片
    if (req.file) {
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('yuanyue')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('yuanyue')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    const updatedFields = {
      title: title || existingArticle.title,
      summary: summary || existingArticle.summary,
      content: content || existingArticle.content,
      author: author || existingArticle.author,
      image: imageUrl
    };

    // 更新文章 (detailPageUrl保持不变，因为使用动态URL)
    const { data: updatedArticle, error: updateError } = await supabase
      .from('articles')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ message: 'Article updated successfully', article: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// 将所有旧的静态URL更新为新的动态URL
app.post('/api/migrate-to-dynamic-urls', async (req, res) => {
  try {
    // 获取所有文章
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('*');

    if (fetchError) throw fetchError;

    let updated = 0;
    let skipped = 0;

    // 为每篇文章更新为动态URL
    for (const article of articles) {
      // 检查是否需要更新（旧的静态URL格式或空值）
      if (!article.detailPageUrl ||
          article.detailPageUrl.includes('/articles/article-') ||
          article.detailPageUrl.includes('News page')) {

        // 生成新的动态URL
        const newDetailPageUrl = `/pages/article.html?id=${article.id}`;

        const { error: updateError } = await supabase
          .from('articles')
          .update({ detailPageUrl: newDetailPageUrl })
          .eq('id', article.id);

        if (!updateError) {
          updated++;
          console.log(`Migrated article ${article.id}: ${newDetailPageUrl}`);
        }
      } else if (article.detailPageUrl.includes('article.html?id=')) {
        // 已经是新格式，跳过
        skipped++;
      }
    }

    res.json({
      message: 'Article URLs migrated to dynamic format successfully',
      updated: updated,
      skipped: skipped,
      total: articles.length
    });
  } catch (error) {
    console.error('Error migrating article URLs:', error);
    res.status(500).json({ error: 'Failed to migrate article URLs' });
  }
});

// 启动服务器
async function startServer() {
  await ensureArticlesDir();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin/`);
    console.log(`Supabase connected: ${process.env.SUPABASE_URL}`);
  });
}

// 本地开发时启动服务器
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// Vercel 需要导出 app
module.exports = app;
