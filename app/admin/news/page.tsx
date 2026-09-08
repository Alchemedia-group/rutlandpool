import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/types";
import { createNewsPost, deleteNewsPost } from "../actions";

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("*")
    .order("published_at", { ascending: false });
  const posts = (data as NewsPost[]) ?? [];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">News</h1>

      <form action={createNewsPost} className="mb-10 grid max-w-lg gap-3">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input name="title" required className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Body</label>
          <textarea
            name="body"
            required
            rows={6}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked />
          Published (visible on the public site)
        </label>
        <button type="submit" className="rounded bg-felt px-4 py-2 text-white">
          Post
        </button>
      </form>

      <ul className="divide-y divide-gray-200">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">
                {post.title}
                {!post.published && (
                  <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                    draft
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(post.published_at).toLocaleDateString("en-GB")}
              </p>
            </div>
            <form action={deleteNewsPost}>
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
