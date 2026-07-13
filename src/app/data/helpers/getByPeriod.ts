import { Model, PopulateOptions, FilterQuery } from 'mongoose';

export async function getByPeriod<T>(
  model: Model<T>,
  operatingPeriod: string,
  populate?: PopulateOptions[],
  sort: Record<string, 1 | -1> = { createdAt: -1 },
): Promise<T[]> {
  // define el filtro como FilterQuery<T>
  const filter: FilterQuery<T> = { operatingPeriod } as FilterQuery<T>;

  const data = await model
    .find(filter)
    .populate(populate || [])
    .sort(sort)
    .lean();

  return data as T[];
}
