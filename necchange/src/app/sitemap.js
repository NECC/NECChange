export default function sitemap() {
  return [
    {
      url: 'https://necchange.necc.di.uminho.pt',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://necchange.necc.di.uminho.pt/profile',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://necchange.necc.di.uminho.pt/auth/signin',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    }
  ]
}