# 来源与许可 / Third-party notices

## 项目代码

本项目新增的展示、检索与目录代码按根目录 MIT LICENSE 发布。
第三方代码与素材仍按各自许可使用，根目录 MIT 不重新许可下列资源。

## 模型、清单与派生画面

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- 数据库许可：https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- 许可文本：https://creativecommons.org/licenses/by/4.0/
- 模型整理：https://github.com/ashemag/human-atlas
- 本项目素材使用的整理版本：`1c38bf35c254a891200d3cedecfd57abebe83d8d`
- 上游代码许可：`LICENSES/human-atlas-MIT.txt`
- 上游来源说明保留在 `public/downloads/ATTRIBUTION.md`；其中提到的历史女性模型并不包含在本发行包中。

本项目对右手子集进行导出、配套清单整理和交互展示。网页模型为居中和缩放后的观察视图，下载 GLB 保留原始单位与整体坐标。模型不由本项目原创，不能把上游项目使用量归入本项目。

`public/models/` 的几何数据、下载模型与清单、`public/media/` 和下载区的解剖结构派生画面按 CC BY 4.0 处理并保留上述署名。27 个骨骼部件仅代表当前参考子集；视频中展示的 2,234 个全身部件不是本包提供的 2,234 个可下载模型。

## UI 组件

`components/ui/` 的组件基于 shadcn/ui。MIT 许可全文和版权声明保留在 `LICENSES/shadcn-MIT.txt`。

## 运行依赖

React、Three.js、Base UI、Lucide、Tailwind CSS 及其他依赖通过 npm 安装；其各自许可保留于依赖包。此发行包不包含 node_modules。

核验日期：2026-09-18。来源页面使用说明不能替代第三方许可原文。
