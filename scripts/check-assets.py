"""Validate bundled source identities and mesh data with the Python standard library."""
import csv
import json
import math
import struct
from pathlib import Path

root = Path(__file__).resolve().parents[1]
public = root / 'public'
parts = json.loads((public / 'models/right-hand.json').read_text())
with (public / 'downloads/right-hand-parts.csv').open(encoding='utf-8-sig', newline='') as f:
    rows = list(csv.DictReader(f))
ids = [part['id'] for part in parts]
assert len(parts) == 27 and len(set(ids)) == 27, 'Expected 27 distinct source parts'
assert set(ids) == {row['source_id'] for row in rows}, 'CSV and mesh source IDs differ'
row_by_id = {row['source_id']: row for row in rows}
triangles = 0
for part in parts:
    positions, normals, indices = part['positions'], part['normals'], part['indices']
    assert len(positions) > 0 and len(positions) % 3 == 0
    assert len(normals) == len(positions)
    assert all(math.isfinite(v) for v in positions + normals)
    assert len(indices) % 3 == 0
    vertex_count = len(positions) // 3
    assert all(isinstance(i, int) and 0 <= i < vertex_count for i in indices), part['id']
    row = row_by_id[part['id']]
    assert int(row['vertex_count']) == vertex_count
    assert int(row['triangle_count']) == len(indices) // 3
    assert row['name'] == part['name']
    triangles += len(indices) // 3

glb = (public / 'downloads/right-hand.glb').read_bytes()
magic, version, total = struct.unpack_from('<4sII', glb)
assert magic == b'glTF' and version == 2 and total == len(glb)
chunk_length, chunk_type = struct.unpack_from('<II', glb, 12)
assert chunk_type == 0x4E4F534A
scene = json.loads(glb[20:20 + chunk_length])
assert len(scene['meshes']) == 27 and len(scene['nodes']) == 27
catalog = json.loads((public / 'downloads/material-catalog.json').read_text())['materials']
for material in catalog:
    for field in ['href', 'preview']:
        if material.get(field):
            path = (public / material[field].lstrip('/')).resolve()
            assert path.is_relative_to(public.resolve()) and path.is_file(), material[field]
    for field in ['id', 'source', 'sourceUrl', 'license', 'attribution', 'version']:
        assert material.get(field), (material['id'], field)
print(f'PASS: {len(parts)} source IDs, {triangles} triangles, 27 GLB meshes, {len(catalog)} material records')
