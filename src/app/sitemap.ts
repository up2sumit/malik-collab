import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { sports } from "@/lib/sports";

const routes = ["", "/creators", "/brands", "/collaborations", "/resources", "/about", "/apply", "/partner", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...sports.map((s) => `/sports/${s.slug}`)].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
