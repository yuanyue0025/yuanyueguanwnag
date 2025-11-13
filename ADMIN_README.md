# 文章管理后台系统使用说明

## 系统概述

这是一个简单的文章管理后台系统，允许你通过后台界面添加、管理文章，前端页面会自动显示最新的3篇文章。

## 系统架构

- **后端**: Node.js + Express
- **数据存储**: JSON 文件 (`data/articles.json`)
- **前端**: 原生 HTML/CSS/JavaScript
- **文件上传**: Multer (图片存储在 `images/articles/`)

## 安装步骤

### 1. 安装 Node.js 依赖

```bash
npm install
```

这会安装以下依赖：
- express: Web 服务器框架
- cors: 跨域资源共享
- multer: 文件上传处理

### 2. 启动服务器

```bash
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动

## 使用指南

### 访问后台管理

1. 启动服务器后，在浏览器中访问：
   ```
   http://localhost:3000/admin/
   ```

2. 你会看到一个后台管理界面，分为两部分：
   - **左侧**: 添加新文章的表单
   - **右侧**: 已发布文章的列表

### 添加文章

1. 填写以下信息：
   - **文章标题** (必填): 文章的标题
   - **文章摘要** (必填): 简短描述，会在列表页显示
   - **文章内容** (必填): 完整的文章内容
   - **作者** (可选): 默认为 "Admin"
   - **文章配图** (可选): 上传一张图片

2. 点击"发布文章"按钮

3. 成功后会看到绿色提示消息，右侧列表会自动更新

### 删除文章

1. 在右侧文章列表中找到要删除的文章
2. 点击红色的"删除"按钮
3. 确认删除操作

### 查看前端效果

1. 在浏览器中访问博客页面：
   ```
   http://localhost:3000/pages/blog.html
   ```

2. 页面顶部会显示"Latest Articles"区域，自动展示最新的3篇文章

3. 每次添加新文章后，刷新页面即可看到更新

## 文件结构

```
digital-human-kiosk-website-main/
├── server.js                 # 后端服务器
├── package.json             # 项目配置和依赖
├── admin/                   # 后台管理界面
│   ├── index.html          # 后台页面
│   └── admin.js            # 后台脚本
├── data/                    # 数据存储
│   └── articles.json       # 文章数据
├── images/                  # 图片资源
│   └── articles/           # 文章上传的图片
└── pages/
    └── blog.html           # 前端博客页面（已修改为动态加载）
```

## API 接口说明

系统提供以下 REST API：

### 获取所有文章
```
GET /api/articles
```

### 获取最新3篇文章
```
GET /api/articles/latest
```

### 添加新文章
```
POST /api/articles
Content-Type: multipart/form-data

Body:
- title: string (必填)
- summary: string (必填)
- content: string (必填)
- author: string (可选)
- image: file (可选)
```

### 删除文章
```
DELETE /api/articles/:id
```

### 更新文章
```
PUT /api/articles/:id
Content-Type: multipart/form-data

Body: 同添加文章
```

## 数据格式

文章数据存储在 `data/articles.json` 中，每篇文章包含：

```json
{
  "id": "1699876543210",
  "title": "文章标题",
  "summary": "文章摘要",
  "content": "文章完整内容",
  "author": "作者名",
  "date": "2025-11-12T06:30:00.000Z",
  "image": "/images/articles/1699876543210-123456789.jpg"
}
```

## 注意事项

1. **数据持久化**: 文章数据存储在 JSON 文件中，服务器重启后数据不会丢失

2. **图片存储**: 上传的图片保存在 `images/articles/` 目录，文件名会自动加上时间戳

3. **端口占用**: 如果 3000 端口被占用，可以修改 `server.js` 中的 `PORT` 变量

4. **CORS**: 已配置 CORS，允许跨域访问 API

5. **安全性**: 这是一个简单的演示系统，没有身份验证。生产环境中应该添加：
   - 用户登录验证
   - 权限控制
   - 输入验证和清理
   - HTTPS 加密

## 故障排除

### 问题1: 无法启动服务器
**解决方案**: 确保已经运行 `npm install` 安装了所有依赖

### 问题2: 前端页面无法加载文章
**解决方案**:
- 检查服务器是否正在运行
- 打开浏览器控制台查看错误信息
- 确认 API 地址是否正确（`http://localhost:3000`）

### 问题3: 图片无法上传
**解决方案**:
- 确保 `images/articles/` 目录存在且有写权限
- 检查图片文件大小（默认限制可在 `server.js` 中配置）

### 问题4: 文章数据丢失
**解决方案**: 检查 `data/articles.json` 文件是否存在，如果损坏可以手动修复为 `[]`

## 扩展功能建议

如果需要增强系统，可以考虑：

1. **富文本编辑器**: 集成 TinyMCE 或 Quill 编辑器
2. **Markdown 支持**: 使用 Markdown 编写文章
3. **分类和标签**: 为文章添加分类和标签功能
4. **搜索功能**: 实现文章搜索
5. **数据库**: 使用 MongoDB 或 MySQL 替代 JSON 文件
6. **分页**: 当文章很多时添加分页功能
7. **SEO 优化**: 为每篇文章生成独立的详情页
8. **评论系统**: 添加文章评论功能

## 联系支持

如有问题，请联系：
- Email: advance9010@gmail.com
- Phone: +852 51404066

---

**元岳科技 | YuanYue Technology**
