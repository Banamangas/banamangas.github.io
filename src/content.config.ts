import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    thumbnail: z.string(),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    featured: z.boolean().default(false),
    stats: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { projects };
