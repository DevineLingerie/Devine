"use server";

import { createContactStore, getRequestIpHash } from "@/lib/contact/store";
import { processContactSubmission } from "@/lib/contact/submit";
import { readContactForm, type ContactFormState } from "@/lib/validation/contact";

export async function submitContactRequest(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  return processContactSubmission(readContactForm(formData), {
    store: createContactStore(),
    ipHash: await getRequestIpHash(),
    now: Date.now(),
  });
}
