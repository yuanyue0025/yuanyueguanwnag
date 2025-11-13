# 管理后台使用说明

## 访问地址

- **本地**: http://localhost:3000/admin/login.html
- **线上**: https://www.yyi.ai/admin/login.html

## 默认登录账号

```
用户名: admin
密码: yuanyue2025
```

## 修改管理员账号

### 方法 1: 修改环境变量 (推荐)

在 `.env` 文件中设置:

```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
```

### 方法 2: Vercel 环境变量

在 Vercel Dashboard 中添加环境变量:

1. 登录 Vercel Dashboard
2. 选择项目
3. Settings → Environment Variables
4. 添加以下变量:
   - `ADMIN_USERNAME` = 你的用户名
   - `ADMIN_PASSWORD` = 你的密码

## 功能说明

### 登录页面
- 用户名/密码验证
- 密码显示/隐藏切换
- 自动记住登录状态 (Session Storage)
- 错误提示和动画效果

### 管理后台
- 文章列表展示
- 添加新文章
- 编辑文章
- 删除文章
- 上传图片到 Supabase
- 富文本编辑器 (Quill.js)
- 退出登录按钮

## 安全说明

- 使用 Session Storage 保存登录状态
- 刷新页面后需要重新登录
- 关闭浏览器后自动退出登录
- **重要**: 生产环境请务必修改默认密码!

## 技术栈

- 前端: HTML + CSS + JavaScript
- 后端: Node.js + Express
- 数据库: Supabase (PostgreSQL)
- 富文本编辑器: Quill.js
- 图片存储: Supabase Storage
