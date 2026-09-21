# Orthographic visualization of the actual downloadable mesh, not an illustration.
import json
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[1]
parts=json.loads((root/'public/models/right-hand.json').read_text())
pts=np.concatenate([np.array(p['positions']).reshape(-1,3) for p in parts])
center=(pts.min(0)+pts.max(0))/2
scale=280/max(np.ptp(pts,axis=0))
faces=[]
light=np.array([-.3,.5,1.]);light/=np.linalg.norm(light)
for part in parts:
 v=np.array(part['positions']).reshape(-1,3)-center
 v[:,:2]*=-1
 for triangle in np.array(part['indices']).reshape(-1,3):
  f=v[triangle]; normal=np.cross(f[1]-f[0],f[2]-f[0]);length=np.linalg.norm(normal)
  lum=.64+.36*max(0,np.dot(normal/length,light)) if length else .7
  rgb=tuple(int(c*lum) for c in (240,231,207))
  xy=f[:,:2]*scale;xy[:,1]*=-1;xy+=np.array([300,180])
  points=' '.join(f'{x:.1f},{y:.1f}' for x,y in xy)
  faces.append((float(f[:,2].mean()),f'<polygon points="{points}" fill="rgb{rgb}"/>'))
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360"><title>右手骨骼真实网格正投影</title>'+''.join(x[1] for x in sorted(faces,key=lambda x:x[0]))+'</svg>'
(root/'public/media/right-hand-preview.svg').write_text(svg)
print(f'Rendered {len(faces)} triangles from {len(parts)} source meshes.')
