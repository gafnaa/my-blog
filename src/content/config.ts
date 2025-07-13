import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Gunakan z.coerce.date() untuk mengubah string menjadi Date secara otomatis
    pubDate: z.coerce.date(), 
    slug: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  blog,
};