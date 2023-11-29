export default function sitemap(){
  return [
    {
      url: "https://necchange.necc.di.uminho.pt",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://necchange.necc.di.uminho.pt/auth",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://necchange.necc.di.uminho.pt/profile",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
