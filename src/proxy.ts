import type { NextRequest } from "next/server";
import { updateAdminSession } from "@/lib/supabase/proxy";

// Le proxy ne s'exécute que sur l'administration : les pages publiques
// restent statiques et ne lisent aucun cookie.
export async function proxy(request: NextRequest) {
  return updateAdminSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
