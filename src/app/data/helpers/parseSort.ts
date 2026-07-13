export function parseSort(sort?: string | Record<string, 1 | -1>): Record<string, 1 | -1> {
  if (!sort) return { createdAt: -1 };

  if (typeof sort === 'string') {
    const [field, direction] = sort.split(':');
    return { [field]: direction === 'asc' ? 1 : -1 };
  }

  return sort;
}
