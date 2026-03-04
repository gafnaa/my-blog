import type {
  CardListData,
  Config,
  IntegrationUserConfig,
  ThemeUserConfig,
} from "astro-pure/types";

export const theme: ThemeUserConfig = {
  title: "Gafna Blog",
  author: "Gafna Al Faatiha Prabowo",
  description:
    "Personal blog and portfolio focused on cybersecurity CTF writeups, web development, and learning notes.",
  favicon: "/favicon/favicon.ico",
  socialCard: "/images/social-card.png",
  locale: {
    lang: "en-US",
    attrs: "en_US",
    dateLocale: "en-US",
    dateOptions: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  logo: {
    src: "/src/assets/sankya.jpg",
    alt: "Gafna avatar",
  },

  titleDelimiter: "•",
  prerender: true,
  npmCDN: "https://cdn.jsdelivr.net/npm",

  head: [],
  customCss: [],

  header: {
    menu: [
      { title: "Blog", link: "/blog" },
      { title: "Archives", link: "/archives" },
      { title: "Tags", link: "/tags" },
      { title: "Projects", link: "/projects" },
      { title: "About", link: "/about" },
      { title: "Search", link: "/search" },
    ],
  },

  footer: {
    year: `© ${new Date().getFullYear()}`,
    links: [
      {
        title: "RSS",
        link: "/rss.xml",
      },
      {
        title: "Terms",
        link: "/terms",
        pos: 2,
      },
    ],
    credits: true,
    social: {
      github: "https://github.com/gafnaa",
    },
  },

  content: {
    externalLinks: {
      content: " ↗",
      properties: {
        style: "user-select:none",
      },
    },
    blogPageSize: 10,
    share: ["x", "bluesky"],
  },
};

export const integ: IntegrationUserConfig = {
  links: {
    logbook: [],
    applyTip: [
      { name: "Name", val: theme.title },
      { name: "Desc", val: theme.description || "Null" },
      { name: "Link", val: "https://gafnaa.vercel.app/" },
      { name: "Avatar", val: "https://gafnaa.vercel.app/favicon/favicon.ico" },
    ],
    cacheAvatar: false,
  },

  pagefind: true,

  quote: {
    server: "https://dummyjson.com/quotes/random",
    target:
      '(data) => (data.quote?.length > 80 ? `${data.quote.slice(0, 80)}...` : data.quote || "Error")',
  },

  typography: {
    class: "prose text-base",
    blockquoteStyle: "italic",
    inlineCodeBlockStyle: "modern",
  },

  mediumZoom: {
    enable: true,
    selector: ".prose .zoomable",
    options: {
      className: "zoomable",
    },
  },

  waline: {
    enable: false,
    server: "",
    showMeta: false,
    emoji: ["bmoji"],
    additionalConfigs: {
      pageview: false,
      comment: false,
      imageUploader: false,
    },
  },
};

export const terms: CardListData = {
  title: "Terms",
  list: [
    {
      title: "Privacy Policy",
      link: "/terms/privacy-policy",
    },
    {
      title: "Terms and Conditions",
      link: "/terms/terms-and-conditions",
    },
    {
      title: "Copyright",
      link: "/terms/copyright",
    },
    {
      title: "Disclaimer",
      link: "/terms/disclaimer",
    },
  ],
};

const config = { ...theme, integ } as Config;
export default config;
