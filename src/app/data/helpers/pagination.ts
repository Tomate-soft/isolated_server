import { Model, PopulateOptions } from 'mongoose';

export interface PaginatedResponse<T> {
  count: number;
  data: T[];
}

export async function paginate<T>(
  model: Model<T>,
  page = 1,
  limit = 50,
  filter: Record<string, any> = {},
  populate?: PopulateOptions[],
  sort: Record<string, 1 | -1> = { createdAt: -1 }, // default
): Promise<PaginatedResponse<T>> {
  const skip = (page - 1) * limit;

  const [data, count] = await Promise.all([
    model
      .find(filter)
      .populate(populate || [])
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    model.countDocuments(filter),
  ]);

  return { count, data: data as T[] };
}
