# TodoList API 文档

本文档详细说明了TodoList后端API的使用方法。

## 基本信息

- 基础URL: `http://localhost:3002/api`
- 所有请求和响应均采用JSON格式
- 成功的响应包含 `success: true` 和相关数据
- 失败的响应包含 `success: false` 和错误信息

## 认证

目前API不需要认证。

## 待办事项接口

### 1. 获取所有待办事项

获取系统中的所有待办事项，按位置排序。

**请求**:
- 方法: `GET`
- URL: `/todos`

**成功响应** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "完成项目",
      "description": "完成TodoList项目",
      "completed": false,
      "position": 0,
      "created_at": "2023-04-01T12:00:00.000Z",
      "updated_at": "2023-04-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "title": "学习Node.js",
      "description": "深入学习Node.js和Express框架",
      "completed": true,
      "position": 1,
      "created_at": "2023-04-01T13:00:00.000Z",
      "updated_at": "2023-04-01T14:00:00.000Z"
    }
  ]
}
```

### 2. 获取单个待办事项

通过ID获取单个待办事项的详细信息。

**请求**:
- 方法: `GET`
- URL: `/todos/:id`
- 参数: 
  - `id`: 待办事项的ID

**成功响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "完成项目",
    "description": "完成TodoList项目",
    "completed": false,
    "position": 0,
    "created_at": "2023-04-01T12:00:00.000Z",
    "updated_at": "2023-04-01T12:00:00.000Z"
  }
}
```

**失败响应** (404 Not Found):
```json
{
  "success": false,
  "message": "未找到待办事项"
}
```

### 3. 创建待办事项

创建新的待办事项。

**请求**:
- 方法: `POST`
- URL: `/todos`
- 请求体:
  ```json
  {
    "title": "新待办事项",
    "description": "这是一个新的待办事项"
  }
  ```
  - `title`: 必填，待办事项标题
  - `description`: 可选，待办事项描述

**成功响应** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "新待办事项",
    "description": "这是一个新的待办事项",
    "completed": false,
    "position": 2,
    "created_at": "2023-04-01T15:00:00.000Z",
    "updated_at": "2023-04-01T15:00:00.000Z"
  }
}
```

**失败响应** (400 Bad Request):
```json
{
  "success": false,
  "message": "标题是必填字段"
}
```

### 4. 更新待办事项

更新现有待办事项的信息。

**请求**:
- 方法: `PUT`
- URL: `/todos/:id`
- 参数:
  - `id`: 待办事项的ID
- 请求体:
  ```json
  {
    "title": "已更新的标题",
    "description": "已更新的描述",
    "completed": true
  }
  ```
  - `title`: 必填，待办事项标题
  - `description`: 可选，待办事项描述
  - `completed`: 可选，待办事项完成状态

**成功响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "已更新的标题",
    "description": "已更新的描述",
    "completed": true,
    "position": 0,
    "created_at": "2023-04-01T12:00:00.000Z",
    "updated_at": "2023-04-01T16:00:00.000Z"
  }
}
```

**失败响应** (404 Not Found):
```json
{
  "success": false,
  "message": "未找到待办事项"
}
```

### 5. 删除待办事项

删除指定ID的待办事项。

**请求**:
- 方法: `DELETE`
- URL: `/todos/:id`
- 参数:
  - `id`: 待办事项的ID

**成功响应** (200 OK):
```json
{
  "success": true,
  "data": {}
}
```

**失败响应** (404 Not Found):
```json
{
  "success": false,
  "message": "未找到待办事项"
}
```

### 6. 更新待办事项位置

更新待办事项的排序位置。

**请求**:
- 方法: `PATCH`
- URL: `/todos/:id/position`
- 参数:
  - `id`: 待办事项的ID
- 请求体:
  ```json
  {
    "position": 2
  }
  ```
  - `position`: 必填，新的排序位置

**成功响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "完成项目",
    "description": "完成TodoList项目",
    "completed": false,
    "position": 2,
    "created_at": "2023-04-01T12:00:00.000Z",
    "updated_at": "2023-04-01T17:00:00.000Z"
  }
}
```

**失败响应** (400 Bad Request):
```json
{
  "success": false,
  "message": "position是必填字段"
}
```

## 错误代码

- `400 Bad Request`: 请求格式错误或缺少必要字段
- `404 Not Found`: 请求的资源不存在
- `500 Internal Server Error`: 服务器内部错误

## 示例调用

使用curl获取所有待办事项:
```bash
curl -X GET http://localhost:3002/api/todos
```

创建新待办事项:
```bash
curl -X POST http://localhost:3002/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "新待办事项", "description": "这是一个新的待办事项"}'
```

## 服务器环境设置

要运行这个 TodoList 后端应用，您需要以下环境和步骤：

### 必要环境

- Node.js (v14 或更高版本)
- PostgreSQL 数据库

### 设置步骤

1. **初始化数据库**:
   ```bash
   psql -U postgres -f db/init.sql
   ```
   系统会提示您输入密码（默认为 'postgres'）

2. **安装项目依赖**:
   ```bash
   npm install
   ```

3. **启动后端服务**:
   ```bash
   npm start
   ```
   
   > 注意：在某些 Windows 系统中，如果遇到 PowerShell 执行策略限制，可以使用以下命令允许脚本执行：
   > ```powershell
   > Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   > ```
   > 然后再次运行 `npm start`

4. **测试 API**:
   - 服务启动后将运行在 http://localhost:3002
   - 可以使用 Postman 或 curl 等工具测试 API

### 环境配置

项目使用 .env 文件配置环境变量，包括：
- 端口：3002
- 数据库连接信息：
  - 主机：localhost
  - 端口：5432
  - 用户：postgres
  - 密码：postgres
  - 数据库名：todolist 