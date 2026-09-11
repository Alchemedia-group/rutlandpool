import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/data";

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="mt-1 text-sm text-ink/50">
        {new Date(post.published_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <div className="mt-6 max-w-none whitespace-pre-wrap leading-relaxed text-ink">
        {post.body}
      </div>
    </article>
  );
}
