interface SEOProps {
  title: string
  description: string
  type?: 'website' | 'article' | 'profile'
  image?: string
  url?: string
  authorName?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

export default function SEO({ 
  title, 
  description, 
  type = 'website',
  image,
  url,
  authorName,
  publishedTime,
  modifiedTime,
  tags 
}: SEOProps) {
  const schemaData: any = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "Article" : "WebPage",
    "headline": title,
    "description": description,
    "url": url || window.location.href,
    "publisher": {
      "@type": "Organization",
      "name": "Redmit",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png"
      }
    }
  }

  if (authorName) {
    schemaData.author = {
      "@type": "Person",
      "name": authorName
    }
  }

  if (publishedTime) {
    schemaData.datePublished = publishedTime
  }

  if (modifiedTime) {
    schemaData.dateModified = modifiedTime
  }

  if (tags && tags.length > 0) {
    schemaData.keywords = tags.join(', ')
  }

  if (image) {
    schemaData.image = image
  }

  return (
    <>
      <title>{title} | Redmit</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags?.join(', ') || 'community, discussions, questions, answers'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
    </>
  )
}
