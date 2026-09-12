import { createClient } from "@/lib/supabase/server";
import { deleteContactMessage } from "../actions";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default async function AdminContactPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ContactMessage[]>();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Contact messages</h1>
      {!messages || messages.length === 0 ? (
        <p className="text-ink/50">No messages yet.</p>
      ) : (
        <ul className="divide-y divide-ink/10">
          {messages.map((m) => (
            <li key={m.id} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {m.name} <span className="font-normal text-ink/50">&lt;{m.email}&gt;</span>
                  </p>
                  <p className="text-xs text-ink/40">{new Date(m.created_at).toLocaleString("en-GB")}</p>
                </div>
                <form action={deleteContactMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="text-sm text-loss hover:underline">
                    Delete
                  </button>
                </form>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink/80">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
