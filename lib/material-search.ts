export type Material = {
  id: string; title: string; description: string; topic: string; category: string;
  format: string; size: string; href: string; preview: string; previewAlt: string;
  tags: string[]; aliases: string[]; uses: string[]; license: string;
  table?: { columns: string[]; rows: string[][] };
  source: string; sourceUrl: string; attribution: string; version: string;
};
export type MaterialFilters = { query: string; category: string; topic: string; format: string; license: string; tag: string };
export const emptyFilters: MaterialFilters = { query: '', category: 'all', topic: 'all', format: 'all', license: 'all', tag: '' };
export function filterMaterials(materials: Material[], filters: MaterialFilters) {
  const terms = filters.query.normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return materials.filter(item => {
    const text = [item.id, item.title, item.description, item.topic, item.category, item.format, item.license, item.source, ...item.tags, ...item.aliases, ...item.uses].join(' ').normalize('NFKC').toLocaleLowerCase();
    return terms.every(term => text.includes(term)) &&
      (filters.category === 'all' || item.category === filters.category) &&
      (filters.topic === 'all' || item.topic === filters.topic) &&
      (filters.format === 'all' || item.format === filters.format) &&
      (filters.license === 'all' || item.license === filters.license) &&
      (!filters.tag || item.tags.includes(filters.tag) || item.uses.includes(filters.tag));
  });
}
