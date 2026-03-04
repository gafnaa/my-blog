import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");

const ORDER = [
  "title",
  "description",
  "publishDate",
  "updatedDate",
  "slug",
  "category",
  "event",
  "type",
  "tags",
  "draft",
  "comment",
  "language",
];

function unquote(value = "") {
  const v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function toIsoLikeDate(input) {
  const raw = unquote(input);
  const compact = raw.replace("T", " ").trim();

  if (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)?$/.test(raw)
  ) {
    return raw;
  }

  const m = compact.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (m) {
    const [, y, mo, d, h = "00", mi = "00", s = "00"] = m;
    const mm = String(mo).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    const hh = String(h).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${y}-${mm}-${dd}T${hh}:${mi}:${ss}+07:00`;
  }

  const asDate = new Date(raw);
  if (!Number.isNaN(asDate.getTime())) {
    return asDate.toISOString();
  }

  return raw;
}

function normalizeTag(tag) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getAllFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return getAllFiles(full);
      if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) return [full];
      return [];
    }),
  );
  return files.flat();
}

function rebuildFrontmatter(map) {
  const keys = [
    ...ORDER.filter((k) => k in map),
    ...Object.keys(map).filter((k) => !ORDER.includes(k)),
  ];
  const lines = [];

  for (const key of keys) {
    const val = map[key];
    if (val === undefined || val === null) continue;

    if (key === "tags" && Array.isArray(val)) {
      if (!val.length) continue;
      lines.push("tags:");
      for (const tag of val) lines.push(`  - ${JSON.stringify(tag)}`);
      continue;
    }

    if (typeof val === "boolean" || typeof val === "number") {
      lines.push(`${key}: ${val}`);
      continue;
    }

    if (key === "publishDate" || key === "updatedDate") {
      lines.push(`${key}: ${JSON.stringify(String(val))}`);
      continue;
    }

    lines.push(`${key}: ${JSON.stringify(String(val))}`);
  }

  return `---\n${lines.join("\n")}\n---`;
}

async function migrateFile(file) {
  const original = await fs.readFile(file, "utf8");
  const match = original.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if (!match) return false;

  const rawFrontmatter = match[1];
  const body = original.slice(match[0].length);
  const map = {};

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    const [, key, value] = m;
    map[key] = unquote(value);
  }

  if (map.pubDate && !map.publishDate) {
    map.publishDate = toIsoLikeDate(map.pubDate);
    delete map.pubDate;
  } else if (map.publishDate) {
    map.publishDate = toIsoLikeDate(map.publishDate);
  }

  if (typeof map.heroImage === "string" && map.heroImage.trim() === "") {
    delete map.heroImage;
  }

  const existingTags = [];
  const extraTags = [map.category, map.event, map.type]
    .filter(Boolean)
    .map(normalizeTag);
  const mergedTags = [
    ...new Set([...existingTags, ...extraTags].filter(Boolean)),
  ];
  if (mergedTags.length) {
    map.tags = mergedTags;
  }

  const content = body
    .replaceAll("/src/content/blog/img/", "/images/blog/")
    .replaceAll("](./img/", "](/images/blog/")
    .replaceAll("](../img/", "](/images/blog/");

  const migrated = `${rebuildFrontmatter(map)}\n\n${content}`.replace(
    /\n{3,}/g,
    "\n\n",
  );
  if (migrated === original) return false;

  await fs.writeFile(file, migrated, "utf8");
  return true;
}

async function main() {
  const files = await getAllFiles(BLOG_DIR);
  let changed = 0;

  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const touched = await migrateFile(file);
    if (touched) changed += 1;
  }

  console.log(`Processed ${files.length} files, updated ${changed}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
