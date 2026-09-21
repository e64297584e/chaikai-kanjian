import json, csv
from pathlib import Path
root = Path(__file__).resolve().parents[1]
pub = root / 'public'
common = dict(topic='人体结构', license='CC BY 4.0', source='BodyParts3D / DBCLS', sourceUrl='https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html', version='1.0')
items = [
 dict(id='CKK-001-M01', title='右手骨骼', description='27 个独立骨骼网格，保留来源编号。可导入 Blender，继续观察、拆分与创作。', category='三维模型', format='GLB', href='/downloads/right-hand.glb', preview='/media/right-hand-preview.svg', previewAlt='从实际右手骨骼网格生成的正投影视图', tags=['右手','骨骼','可拆分'], aliases=['hand','skeleton','3d','三维','模型','腕骨','掌骨','指骨','Blender','手掌','手部','人體','骨骼模型'], uses=['课件制作','三维创作'], attribution='BodyParts3D © DBCLS；模型整理：ashemag/human-atlas；右手子集导出：拆开看见。'),
 dict(id='CKK-001-D01', title='右手骨骼 · 部件清单', description='27 个来源编号与英文名称。查部件、对模型，让每一块骨骼都能追溯。', category='数据清单', format='CSV', href='/downloads/right-hand-parts.csv', preview='', previewAlt='', tags=['右手','骨骼','部件清单'], aliases=['hand','skeleton','data','excel','表格','编号','索引','reference','清單','数据'], uses=['资料检索','课件制作'], attribution='名称与编号：BodyParts3D © DBCLS；整理：拆开看见。'),
 dict(id='CKK-001-I01', title='身体结构 · 排列墙', description='将模型部件排列成一幅结构画面。用于观察构图、组织信息和制作视觉参考。', category='参考图片', format='JPG', href='/downloads/anatomy-wall.jpg', preview='/downloads/anatomy-wall.jpg', previewAlt='人体模型部件排列墙，深色底上的结构参考画面', tags=['身体结构','结构排列','竖屏'], aliases=['human','anatomy','image','jpg','jpeg','图片','人体','人体拆解','人體','解剖','壁纸','1080','1920'], uses=['构图参考','视觉创作'], attribution='结构画面：拆开看见；模型：BodyParts3D © DBCLS；模型整理：ashemag/human-atlas。')
]
for item in items:
 item.update(common)
 if item['format'] == 'CSV':
  with (pub / item['href'].lstrip('/')).open(encoding='utf-8-sig', newline='') as f:
   records=list(csv.reader(f))
  item['table']={'columns':records[0], 'rows':records[1:]}
 item['size'] = str(round((pub / item['href'].lstrip('/')).stat().st_size / 1024, 1)) + ' KB'
data = dict(schemaVersion=1, title='拆开看见 · 素材目录', materials=items)
(pub / 'downloads/material-catalog.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
fields = ['id','title','topic','category','format','tags','uses','license','size','href','source','sourceUrl','attribution','version']
with (pub / 'downloads/material-catalog.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
 for item in items: w.writerow({k:' | '.join(item[k]) if isinstance(item[k],list) else item[k] for k in fields})
