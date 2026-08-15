import {parseConsumption, type Consumption} from './consumption-parser';

const markdownModules = import.meta.glob('/consumes/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const parsedConsumptions = Object.entries(markdownModules).map(([sourcePath, raw]) =>
  parseConsumption(sourcePath, raw),
);

const duplicateSlug = parsedConsumptions.find(
  (consumption, index) =>
    parsedConsumptions.findIndex((candidate) => candidate.slug === consumption.slug) !== index,
);
if (duplicateSlug) {
  throw new Error(`Duplicate consumption slug: ${duplicateSlug.slug}`);
}

export const consumptions: readonly Consumption[] = parsedConsumptions
  .filter((consumption) => !consumption.draft)
  .sort((left, right) => right.date.localeCompare(left.date));

export type {Consumption};
