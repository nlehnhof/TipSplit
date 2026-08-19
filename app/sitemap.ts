import type { MetadataRoute } from "next";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3001";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "/", priority: 1 },
    { path: "/calculator", priority: 0.9 },
    { path: "/pricing", priority: 0.8 },
    { path: "/login", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ] as const;

  return paths.map(({ path, priority }) => ({
    url: `${APP_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
