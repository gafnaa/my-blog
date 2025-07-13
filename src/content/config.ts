import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(), // ubah ini jadi z.string() kalau pubDate kamu belum berbentuk Date
    slug: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
