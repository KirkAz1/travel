# 旅游网站后端 API

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.env` 文件，参考以下配置：
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=travel_website
JWT_SECRET=your-secret-key
PORT=3000
```

### 3. 创建数据库
执行 `travel_website.sql` 文件中的SQL语句创建数据库和表。

### 4. 启动服务器
```bash
npm start
# 或开发模式（需要安装nodemon）
npm run dev
```

## API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息（需要认证）

### 景点相关
- `GET /api/attractions` - 获取景点列表（支持city, province, keyword, page, limit参数）
- `GET /api/attractions/popular` - 获取热门景点
- `GET /api/attractions/:id` - 获取景点详情

### 游记相关
- `GET /api/travel-notes` - 获取游记列表（支持attraction_id, user_id, keyword, page, limit参数）
- `GET /api/travel-notes/:id` - 获取游记详情
- `POST /api/travel-notes` - 创建游记（需要认证）
- `PUT /api/travel-notes/:id` - 更新游记（需要认证）
- `DELETE /api/travel-notes/:id` - 删除游记（需要认证）

### 评论相关
- `GET /api/comments?target_type=travel_note&target_id=1` - 获取评论列表
- `POST /api/comments` - 创建评论（需要认证）
- `DELETE /api/comments/:id` - 删除评论（需要认证）

### 收藏相关
- `GET /api/favorites` - 获取收藏列表（需要认证）
- `GET /api/favorites/check?target_type=attraction&target_id=1` - 检查是否已收藏（需要认证）
- `POST /api/favorites` - 添加收藏（需要认证）
- `DELETE /api/favorites` - 取消收藏（需要认证）

### 点赞相关
- `POST /api/likes/toggle` - 点赞/取消点赞（需要认证）
- `GET /api/likes/check?target_type=travel_note&target_id=1` - 检查是否已点赞（需要认证）

## 统一返回格式

成功：
```json
{
  "success": true,
  "data": {}
}
```

失败：
```json
{
  "success": false,
  "error_code": "ERROR_CODE",
  "message": "错误信息"
}
```

## 认证说明

需要认证的接口需要在请求头中添加：
```
Authorization: Bearer <token>
```

