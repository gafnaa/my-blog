# My Personal Portfolio

Website portfolio personal yang dibuat menggunakan [Astro](https://astro.build/).  
Menampilkan profil, keahlian, dan tautan sosial, dengan desain clean dan responsif.


## Teknologi

- [Astro](https://astro.build/)
- HTML, CSS (flexbox)

## Struktur Direktori
```bash
src
├── assets
│   ├── astro.svg
│   ├── background.svg
│   └── sankya.jpg
├── components
│   ├── Button.astro
│   ├── Footer.astro
│   ├── Header.astro
│   ├── PostCard.astro
│   └── ProfileSection.astro
├── consts.ts
├── content.config.ts
├── layouts
│   └── MainLayout.astro
├── pages
│   ├── about.astro
│   ├── achievements.astro
│   ├── index.astro
│   ├── posts
│   │   └── index.astro
│   ├── projects.astro
│   └── rss.xml.js
└── styles
    └── global.css
```

## Development

1. Clone repository ini:

   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan server development:
   ```bash
   npm run dev
   ```
4. Buka browser ke http://localhost:3000