import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";

// Lien reçu par e-mail (réinitialisation du mot de passe). Le modèle d'e-mail
// Supabase doit pointer ici : voir docs/administration.md.
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type === "recovery") {
    const supabase = await createSessionClient();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
      if (!error) redirect("/admin/compte?reinitialisation=1");
    }
  }
  redirect("/admin/connexion?erreur=lien");
}
