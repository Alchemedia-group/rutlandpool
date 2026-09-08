import Link from "next/link";
import { getPublishedNews } from "@/lib/data";

export default async function NewsPage() {
  const posts = await getPublishedNews();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">News</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No news posted yet.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-gray-100 pb-6">
              <Link href={`/news/${post.slug}`} className="text-lg font-semibold hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(post.published_at).toLocaleDateString("en-GB")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
