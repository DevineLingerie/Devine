import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicSupabaseConfig } from "@/lib/env";

/**
 * Rafraîchit la session Supabase à chaque requête vers l'administration et
 * renvoie vers la page de connexion si aucun utilisateur n'est connecté.
 * Ce contrôle est un confort de navigation : l'autorisation réelle est vérifiée
 * dans chaque page et action (requireAdmin) et par la RLS.
 */
export async function updateAdminSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const config = getPublicSupabaseConfig();
  if (!config) return response;

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const publicPaths = ["/admin/connexion", "/admin/auth/confirm"];
  const isLoginPage = publicPaths.includes(request.nextUrl.pathname);

  if (!data?.claims && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}
