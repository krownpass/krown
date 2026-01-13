import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/partner"]
            },
            {
                userAgent: "Googlebot",
                allow: ["/", "/partner"]
            }
        ],
        sitemap: "https://krownpass.com/sitemap.xml",
    };
}
