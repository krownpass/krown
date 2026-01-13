
export default function sitemap() {
    return [
        {
            url: "https://krownpass.com",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: "https://krownpass.com/partner",
            priority: 0.9
        }
    ];
}
