import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  url?: string
}

export default function SEO({ title, description, url }: SEOProps) {
  useEffect(() => {
    // 1. Update Page Title
    document.title = `${title} | Redmit`
    
    // 2. Update Meta Description (What Google shows in search results)
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', description)
    
    // 3. Update Open Graph Tags (For beautiful previews when shared on WhatsApp/Twitter)
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)
    
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', description)

    // 4. Add Q&A Schema Markup (CRITICAL for Google to understand it's a question & answer)
    const schema = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      "mainEntity": {
        "@type": "Question",
        "name": title,
        "text": description,
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": description
        }
      }
    }
    
    let scriptTag = document.getElementById('schema-qa')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = 'schema-qa'
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }
    scriptTag.innerHTML = JSON.stringify(schema)

  }, [title, description, url])

  return null
}