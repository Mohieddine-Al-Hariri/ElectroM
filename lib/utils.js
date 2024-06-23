
export function constructMetadata({
  title = "ElectroM - Your Best Mobile Store",
  description = "ElectroM is an online mobile and related gadgets store.",
  image = "/Logo.png",
  icons = "/favicon.ico",
  noIndex = false
}) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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