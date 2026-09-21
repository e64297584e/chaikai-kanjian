# 素材目录维护

网页检索读取 `public/downloads/material-catalog.json`。下载区的 CSV 目录由同一份数据生成，保持标签和来源一致。

新增素材时，在 `scripts/prepare-catalog.py` 的 items 中增加一条真实素材记录，放好文件和预览，再运行该脚本。不要只在网页上手动增加一个标签。

每份素材需要：
- id：固定编号，例如 CKK-001-M01。发布后不随标题变化而改变。
- title / description：名称与收录范围。
- topic：主题一级分类；目前为“人体结构”。有真实内容后再添加汽车、城市等主题。
- category：素材类型；目前为“三维模型”“数据清单”“参考图片”。
- tags：具体对象、结构与表现方式，例如“右手”“骨骼”“结构排列”。尽量复用已有词。
- aliases：中英文同义词、常用检索词；只服务搜索，不当作全部公开标签展示。
- uses：可取用的实际用途，例如“课件制作”“构图参考”。
- format / href / preview：真实文件格式、下载地址、预览地址。
- source / sourceUrl / license / attribution：原始来源、已核验的许可、署名文本。不可套用上一份素材的许可。
- version：素材版本。

搜索支持多个关键词共同匹配。主题、类型、格式、许可和标签之间取交集。点击素材卡上的标签会清除其他筛选后查找同标签素材；上方快捷标签在当前筛选内切换。清除筛选返回全部。

`right-hand-preview.svg` 是对实际 27 个网格进行正投影生成的缩略图，由 `scripts/render-hand-preview.py` 生成；不是额外模型，也没有添加未收录部件。

本次界面参考：Google Arts & Culture 的主题导航和留白、Smithsonian 3D 的展品优先与探索入口。未复制第三方网站的图片、标识或代码。
