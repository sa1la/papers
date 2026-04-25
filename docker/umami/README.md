# Umami 自托管部署

[Umami](https://umami.is/) 是一个简单、快速、隐私友好的网站分析工具。

本项目使用 SQLite 作为数据库，零配置、单文件、资源占用极低，适合个人博客场景。

## 前置要求

- Docker + Docker Compose
- 至少 256MB 可用内存

## 首次部署

```bash
# 进入本目录
cd docker/umami

# 复制环境变量模板
cp .env.example .env

# 编辑 .env，填入真实值
# APP_SECRET: 运行 openssl rand -hex 32 生成
# UMAMI_PORT: 如需暴露到其他端口可修改
# DATA_PATH: 服务器部署建议改为绝对路径，如 /opt/umami-data

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

SQLite 备份极其简单，只需复制数据文件：

```bash
# 备份数据目录
tar czf umami-data-backup-$(date +%Y%m%d).tar.gz ${DATA_PATH}
```

数据文件位于 `${DATA_PATH}/umami.db`。

## 切换数据库

如需切换到 PostgreSQL（高并发、多站点场景）：
1. 备份现有数据
2. 将 `docker-compose.yml` 中的镜像改为 `ghcr.io/umami-software/umami:postgresql-latest`
3. 添加 PostgreSQL 服务并配置 `DATABASE_URL`
4. 参考 [Umami 官方文档](https://umami.is/docs/environment-variables)

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

| 文件 | 说明 |
|------|------|
| `docker-compose.yml` | 服务编排定义 |
| `.env.example` | 环境变量模板 |
| `.env` | 真实配置（由 `.gitignore` 忽略，不提交到仓库） |
