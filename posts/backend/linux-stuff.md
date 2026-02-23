---
date: 2024-12-19 00:00:24 +08:00
title: 服务器上的一些操作
category: backend
outline: "deep"
tags: ["backend"]
draft: false

---

记些服务器上执行的命令。

## User

```bash
sudo adduser newuser
sudo usermod -aG sudo newuser
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id -i ~/.ssh/id_ed25519.pub newuser@your_server_ip
sudo nano /etc/ssh/sshd_config
```

如果提示用户无权限，就手动加到sudo上

```bash
visudo
your_username ALL=(ALL:ALL) ALL
```

如果提示没有该目录或者文件可以手动创建

```bash
whoami
sudo chown your_username /home/your_username
cd /home/your_username
ls -ld .ssh
mkdir .ssh
chmod 700 .ssh
ls -l .ssh/authorized_keys
touch .ssh/authorized_keys
chmod 600 .ssh/authorized_keys
chown -R your_username:your_username .ssh
```

最后配置SSH规则

```ini
PermitRootLogin no                 # Disable root login
PasswordAuthentication no          # Disable password authentication
PubkeyAuthentication yes           # Enable public key authentication
AuthorizedKeysFile .ssh/authorized_keys # Specify authorized_keys file location
AllowUsers newuser                 # Only allow specific users to login
```

配置完重启SSH

```bash
sudo service ssh restart
```

## 安装 oh-my-zsh

```shell
sudo apt install zsh -y ##安装zsh

chsh -s /bin/zsh ##启用zsh

echo $SHELL ##检查是否成功

sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" ##安装oh-my-zsh

git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions ##安装提示插件

echo "source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc ##安装高亮插件

source .zshrc ##启用配置
```

设置主题

```txt
ZSH_THEME="gallois"
```

## Nginx

### 安装

```bash
sudo apt update
sudo apt install nginx -y
sudo nginx -version
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx

```

### 配置

#### 静态网站

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    root /var/www/example.com/html;
    index index.html index.htm;
    location / {
        try_files $uri $uri/ =404;
    }
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log warn;

    # SSL configuration (uncomment after running Certbot)
    # listen 443 ssl http2;
    # listen [::]:443 ssl http2;
    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_prefer_server_ciphers on;
    # ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    # Certbot will add its own SSL certificate paths
    # ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
}
```

#### 代理

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.example.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Logging
    access_log /var/log/nginx/app.example.com.access.log;
    error_log /var/log/nginx/app.example.com.error.log warn;

    # SSL configuration (uncomment after running Certbot)
    # listen 443 ssl http2;
    # listen [::]:443 ssl http2;
    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_prefer_server_ciphers on;
    # ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    # Certbot will add its own SSL certificate paths
    # ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
}
```

#### SSL

使用**certbot**来负责SSL证书的申请和自动续签，运行以下指令来安装**certbot**

```sh
sudo apt install certbot python3-certbot-nginx
```

安装完后运行**certbot**，就会询问你要给哪几个server_name申请证书，选择就可以自动申请了

如果要检查**certbot**是否运行良好，可以运行以下指令检查

```sh
sudo systemctl status certbot.timer
```

#### 其他相关

部署vitepress打包的资源，可以结合静态资源配置

```nginx
server {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    listen 80;
    server_name _;
    index index.html;

    location / {
        # content location
        root /app;

        # exact matches -> reverse clean urls -> folders -> not found
        try_files $uri $uri.html $uri/ =404;

        # non existent pages
        error_page 404 /404.html;

        # a folder without index.html raises 403 in this setup
        error_page 403 /404.html;

        # adjust caching headers
        # files in the assets folder have hashes filenames
        location ~* ^/assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```
