import { pageSchema } from "@/lib/validation/content";
import type { Insert } from "@/lib/supabase/database.types";
import { zodFieldErrors } from "./form-state";

// Formulaire d'édition d'une page. Les sections sont identifiées par leur
// clé (fixée par le code) : la gérante modifie leur titre et leur texte, sans
// pouvoir en ajouter ou en retirer, ce qui protège la mise en page.

export type PageFormResult =
  | { success: true; row: Omit<Insert<"pages">, "slug"> }
  | { success: false; fieldErrors: Record<string, string> };

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function parsePageForm(formData: FormData, slug: string, sectionKeys: string[]): PageFormResult {
  const parsed = pageSchema.safeParse({
    slug,
    title: read(formData, "title"),
    description: read(formData, "description"),
    heading: read(formData, "heading"),
    intro: read(formData, "intro"),
    heroImageId: read(formData, "heroImageId"),
    isPublished: formData.get("isPublished") === "on",
    sections: sectionKeys.map((key) => ({
      key,
      heading: read(formData, `sections.${key}.heading`),
      body: read(formData, `sections.${key}.body`),
    })),
  });
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: zodFieldErrors(parsed.error, (path) => {
        const section = path.match(/^sections\.(\d+)\.(heading|body)$/);
        return section ? `sections.${sectionKeys[Number(section[1])]}.${section[2]}` : path;
      }),
    };
  }
  const data = parsed.data;
  return {
    success: true,
    row: {
      title: data.title,
      description: data.description,
      heading: data.heading,
      intro: data.intro,
      sections: data.sections,
      hero_image_id: data.heroImageId,
      is_published: data.isPublished,
    },
  };
}
