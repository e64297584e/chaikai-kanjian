# 0.1.0 发行准备核验

核验日期：2026-09-18。

已通过：
- npm install 完成并生成 package-lock.json。
- npm run build 完成：TypeScript 检查与 Vite 生产构建通过。
- python3 scripts/check-assets.py 通过：27 个独立来源编号、9,032 个三角形、27 个 GLB 网格、3 条素材目录记录。
- 发布源文件扫描未发现私有部署项目 ID、工作区绝对路径、Git 凭据或常见密钥格式。
- 已去除原建站平台插件与部署配置，源码使用标准 React/Vite。
- 已保留 BodyParts3D、human-atlas 与 shadcn 的来源和许可说明。

限制：
- 远程浏览器访问本地预览被 ERR_BLOCKED_BY_CLIENT 阻止，因此本轮没有完成交互与视觉复验；构建通过不等于完整界面测试通过。
- Three.js 构建块约 657 KB（gzip 约 167 KB），触发体积提示，不影响构建。
- 仅包含右手可下载模型；2,234 个部件指既有视频展示范围。
- GitHub 账号已连接；公开仓库发布和 OSS 申请尚未完成，不能声称已开源发布或已入选。
