贪吃蛇游戏部署指南

概述
- 本项目为纯静态网站（仅 `index.html`、`style.css`、`script.js`），无需构建即可上线。
- 你可以选择 GitHub Pages、Netlify 或 Vercel 等平台快速发布。

准备事项
- 确保项目根目录包含 `index.html`（入口文件）。
- 所有资源均使用相对路径（本项目已满足）。

GitHub Pages（推荐，免费且简单）
1) 创建并推送到 GitHub 仓库
- 在项目根目录运行：
  - `git init`
  - `git add .`
  - `git commit -m "Init snake game"`
  - `git branch -M main`
  - `git remote add origin https://github.com/<你的用户名>/<仓库名>.git`
  - `git push -u origin main`

2) 打开仓库 Settings → Pages
- Source 选择“Deploy from a branch”；
- Branch 选择 `main`，Folder 选择 `/ (root)`；保存后等待几分钟。

3) 访问地址
- `https://<你的用户名>.github.io/<仓库名>/`

Netlify（拖拽上传或命令行）
方式 A：网页拖拽
- 注册登录 Netlify → New site from Git → 连接 GitHub 仓库；或使用 “Deploy site” 将项目文件夹拖拽上传。

方式 B：命令行部署（需 Node.js）
- `npm i -g netlify-cli`
- `netlify login`
- `netlify deploy --prod --dir .`
- 完成后控制台会输出站点 URL。

Vercel（命令行极简部署）
- `npm i -g vercel`
- `vercel login`
- 在项目根目录执行：`vercel --prod`
- 按提示创建项目，完成后会获得生产环境 URL。

自定义域名（可选）
- GitHub Pages：在仓库 `Settings → Pages → Custom domain` 绑定域名并在域名 DNS 添加 CNAME 记录指向 `你的用户名.github.io`。
- Netlify/Vercel：在面板的 Domains 中添加域名，按平台指引配置 DNS 记录。

本地预览（可选）
- Python：`python -m http.server 8000`
- Node（serve）：`npx serve .`
- 访问：`http://localhost:8000/`

常见问题
- 页面空白或资源 404：确认已启用 GitHub Pages 且 `index.html` 在根目录；等待几分钟缓存生效。
- 移动端方向键未显示：缩小浏览器至 500px 以下或在 `style.css` 中将 `.mobile-controls { display: none; }` 改为 `display: block;`。

备注
- 项目为静态站点，无需服务器端代码；任何支持静态托管的平台都可直接上线。