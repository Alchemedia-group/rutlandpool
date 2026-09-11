import Link from "next/link";
import { getPublishedNews } from "@/lib/data";

export default async function NewsPage() {
  const posts = await getPublishedNews();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">News</h1>
      {posts.length === 0 ? (
        <p className="text-ink/50">No news posted yet.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-ink/5 pb-6">
              <Link href={`/news/${post.slug}`} className="text-lg font-semibold hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-ink/50">
                {new Date(post.published_at).toLocaleDateString("en-GB")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
