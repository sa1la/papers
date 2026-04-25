# Umami 自托管部署

[Umami](https://umami.is/) 是一个简单、快速、隐私友好的网站分析工具。

本项目使用 PostgreSQL 作为数据库，配合 Umami 官方镜像部署。

## 前置要求

- Docker + Docker Compose v2.1+
- 至少 512MB 可用内存

## 首次部署

**重要**：`.env` 文件包含密码等敏感信息，不纳入 Git 版本控制。首次部署前必须在服务器上手动创建。

```bash
# 进入本目录
cd docker/umami

# 复制环境变量模板并编辑
cp .env.example .env
# 手动编辑 .env 填入真实值：
#   APP_SECRET: 运行 openssl rand -hex 32 生成
#   DB_PASSWORD: 设置一个强密码
#   UMAMI_PORT: 如需暴露到其他端口可修改

# 启动服务
docker compose up -d
```

服务启动后：

- Umami 面板：`http://localhost:3000`（或你配置的端口）
- 默认账号：`admin` / `umami`
- **首次登录后请立即修改默认密码**

## 更新

```bash
docker compose pull
docker compose up -d
```

## 数据备份

```bash
# 先加载环境变量
source .env

# 备份数据库
docker exec umami-db pg_dump -U umami -d umami > "umami-backup-$(date +%Y%m%d).sql"
```

## Nginx 反代配置示例

```nginx
server {
    listen 443 ssl http2;
    server_name umami.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

配置完成后，在 Umami 后台添加你的网站，获取 `data-website-id` 填入博客配置即可。

## 文件说明

| 文件                 | 说明                                           |
| -------------------- | ---------------------------------------------- |
| `docker-compose.yml` | 服务编排定义                                   |
| `.env.example`       | 环境变量模板                                   |
| `.env`               | 真实配置（由 `.gitignore` 忽略，不提交到仓库） |
