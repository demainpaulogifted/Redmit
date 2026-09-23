interface PostData {
  title: string;
  content: string;
  authorName: string;
  date: string;
  replies: { authorName: string; content: string; date: string }[];
}

export default function SEO({ post }: { post: PostData }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": post.title,
      "text": post.content,
      "author": { "@type": "Person", "name": post.authorName },
      "upvoteCount": 24,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": post.replies[0]?.content || "No answer yet.",
        "author": { "@type": "Person", "name": post.replies[0]?.authorName || "Community" }
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}