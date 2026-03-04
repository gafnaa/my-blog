import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Tambahkan properti baru
    category: z.string(), // e.g., "Cryptography", "Web Exploitation"
    type: z.string().default("writeup"), // e.g., "writeup", "note"
    event: z.string().optional(), // e.g., "PicoCTF 2024"
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
