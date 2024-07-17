
export function constructMetadata(
  title = "ElectroM - Your Best Mobile Store",
  description = "ElectroM is an online mobile and related gadgets store.",
  image = "/Hero.png",
  icons = "/favicon.ico",
  noIndex = false
) {
  const absoluteImageUrl = new URL(image, 'https://electro-m.vercel.app').href;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://electro-m.vercel.app',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: 'ElectroM - Your Best Mobile Store',
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImageUrl],
      creator: "@AlMohieddine"
    },
    icons,
    metadataBase: new URL('https://electro-m.vercel.app'),
    themeColor: '#4bc0d9',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}