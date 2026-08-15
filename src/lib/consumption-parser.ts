import {parseTaggedMarkdown, type TaggedMarkdown} from './content-parser';

export type Consumption = TaggedMarkdown & {
  source: string;
  url?: string;
};

function assertPublicUrl(url: string, sourcePath: string): void {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return;
  } catch {
    // The shared error below keeps validation failures consistent.
  }

  throw new Error(`${sourcePath}: optional field "url" must use http or https.`);
}

export function parseConsumption(sourcePath: string, raw: string): Consumption {
  const parsed = parseTaggedMarkdown(
    sourcePath,
    raw,
    (fields) => ({
      source: fields.requiredString('source'),
      url: fields.optionalString('url'),
    }),
    {body: 'optional'},
  );

  if (parsed.url) assertPublicUrl(parsed.url, sourcePath);
  return parsed;
}
