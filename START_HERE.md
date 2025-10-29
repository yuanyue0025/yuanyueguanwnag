# 🚀 Quick Start Guide

## 立即预览网站

### 方法 1: 直接在浏览器打开（最简单）

1. 打开 Finder，找到这个文件夹
2. 双击 `index.html` 文件
3. 网站会在默认浏览器中打开 ✅

### 方法 2: 使用本地服务器（推荐，更真实）

在终端中运行以下命令之一：

```bash
# 进入网站文件夹
cd digital-human-kiosk-website

# 使用 Python 启动服务器（Mac自带）
python3 -m http.server 8000
```

然后在浏览器访问：**http://localhost:8000**

---

## 📄 网站包含的所有页面

✅ **首页** (index.html) - 产品概览、特性展示
✅ **产品页** (pages/products.html) - 3款产品详细信息
✅ **解决方案** (pages/solutions.html) - 4大行业应用
✅ **客户案例** (pages/case-studies.html) - 成功案例和数据
✅ **资源中心** (pages/blog.html) - 下载资料和文章
✅ **关于我们** (pages/about.html) - 公司介绍
✅ **联系我们** (pages/contact.html) - 询价表单

---

## 🎨 网站特点

✨ **现代设计** - 符合欧美审美，专业大气
📱 **完全响应式** - 手机、平板、电脑完美适配
🚀 **加载快速** - 无重度框架，纯 HTML/CSS/JS
🎭 **交互丰富** - 滚动动画、表单验证、数字动画
🔍 **SEO 优化** - 搜索引擎友好，适合 Google 推广

---

## ⚡ 下一步操作

### 1. 替换内容（必做）
- [ ] 更新公司联系信息（邮箱、电话）
- [ ] 添加真实产品图片（放到 images/ 文件夹）
- [ ] 修改公司名称和介绍
- [ ] 更新客户案例（真实数据）

### 2. 品牌定制（可选）
- [ ] 修改配色方案（编辑 css/style.css）
- [ ] 添加公司 Logo
- [ ] 调整字体风格
- [ ] 自定义页脚信息

### 3. 部署上线（推荐）
- [ ] 注册域名（如 digitalhuman-kiosk.com）
- [ ] 选择托管服务：
  - **Netlify** (推荐，免费) - 拖拽上传即可
  - **Vercel** (免费，支持 Git)
  - **传统主机** (通过 FTP 上传)

### 4. 营销设置
- [ ] 添加 Google Analytics 追踪代码
- [ ] 设置 Google Ads 转化追踪
- [ ] 提交到 Google Search Console
- [ ] 配置联系表单邮件接收

---

## 📝 快速修改指南

### 修改颜色主题

编辑 `css/style.css` 文件，找到第 9-18 行：

```css
:root {
    --primary-blue: #1a73e8;    /* 改成你的品牌色 */
    --primary-green: #34a853;
    --primary-yellow: #fbbc04;
    --primary-red: #ea4335;
}
```

### 修改公司信息

编辑 `index.html` 和所有 `pages/*.html`，搜索：
- "AI Kiosk Pro" → 改成你的公司名
- "sales@aikioskpro.com" → 改成你的邮箱
- "+86 138-XXXX-XXXX" → 改成你的电话

### 添加真实图片

1. 将图片放到 `images/` 文件夹
2. 在 HTML 中替换占位符：

```html
<!-- 旧的（占位符）: -->
<img src="data:image/svg+xml,..." alt="...">

<!-- 新的（真实图片）: -->
<img src="images/product-photo.jpg" alt="产品名称">
```

---

## 🆘 常见问题

**Q: 为什么有些图片是彩色方块？**
A: 这些是占位符（SVG），用于演示布局。上线前需要替换成真实产品照片。

**Q: 联系表单能用吗？**
A: 目前只有前端验证，需要连接后端或使用 Formspree/EmailJS 等服务。

**Q: 怎么部署到网上？**
A: 最简单的方法：
1. 注册 Netlify.com 账号
2. 拖拽整个文件夹到网站
3. 自动获得 https://your-site.netlify.app

**Q: 可以用中文吗？**
A: 可以！但这个网站专为英文 SEO 优化，建议保持英文以获得更好的 Google 排名。

---

## 📚 详细文档

完整使用说明请查看：**README.md**

---

## 🎉 就是这样！

你的专业数字人一体机营销网站已经准备就绪。

需要帮助？检查 README.md 或联系开发者。

**祝生意兴隆！** 🚀
