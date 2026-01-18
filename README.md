# My Personal Portfolio & Blog

A modern, responsive portfolio and blog website built with [Astro](https://astro.build/). This project showcases my projects, achievements, and technical notes (CTF writeups, etc.).

## Features

- **Performance-First**: Built with Astro for zero-JS by default frontend architecture.
- **Responsive Design**: Fully responsive layout that looks great on mobile, tablet, and desktop.
- **Dynamic Blog System**: 
  - Markdown/MDX support for rich content.
  - Syntax highlighting with line numbers and copy-to-clipboard functionality.
  - Automatic Table of Contents generation.
  - Organized by Events and Categories.
  - Global navigation sidebar for easy browsing of all posts.
- **Modern UI/UX**:
  - Dark mode aesthetic with custom color palette.
  - Smooth transitions and hover effects.
  - Glassmorphism elements.

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: Vanilla CSS (Scoped & Global), [TailwindCSS](https://tailwindcss.com/)
- **Content**: MDX (Markdown + JSX)
- **Deployment**: [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/) (Compatible with static hosting)

## Directory Structure

```bash
src
├── assets          # Static assets like images and fonts
├── components      # Reusable UI components (Header, Footer, PostCard, etc.)
├── content         # Blog posts and content collections
│   └── blog        # Markdown/MDX files for blog posts
├── layouts         # Page layouts (MainLayout, etc.)
├── pages           # File-based routing
│   ├── index.astro # Homepage
│   ├── posts       # Blog post routes and logic
│   └── ...
├── styles          # Global styles and CSS variables
│   ├── global.css
│   ├── code-block.css
│   └── flag.css
└── consts.ts       # Site-wide constants
```

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```
   
   Open your browser and navigate to `http://localhost:4321` (or the port shown in your terminal).

4. **Build for production:**

   ```bash
   npm run build
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.