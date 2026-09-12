"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  // Honeypot: a hidden field real visitors never fill in. A bot that does
  // gets a fake success instead of a clue to try again differently.
  if (String(formData.get("company") ?? "")) {
    redirect("/contact?sent=1");
  }

  if (!name || !email || !message) {
    redirect("/contact?error=missing");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  if (error) {
    redirect("/contact?error=failed");
  }

  redirect("/contact?sent=1");
}
