"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitContactRequest } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/Button";
import { CONTACT_SUBJECTS, type ContactFormState } from "@/lib/validation/contact";

const initialState: ContactFormState = { status: "idle" };

const inputClass =
  "mt-2 block w-full rounded-xl border border-nuit/30 bg-white/70 px-4 py-3 text-base text-nuit placeholder:text-encre/70 focus:border-nuit aria-[invalid=true]:border-argile";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium text-argile">
      {message}
    </p>
  );
}

export function ContactForm({ enabled }: { enabled: boolean }) {
  const [state, formAction, pending] = useActionState(submitContactRequest, initialState);
  const [startedAt, setStartedAt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (!enabled) {
    return (
      <p className="rounded-2xl border border-nuit/15 bg-sable/60 p-6 text-lg">
        Le formulaire en ligne sera bientôt disponible. En attendant, contactez-nous par téléphone ou passez nous voir en
        boutique.
      </p>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};
  // Clé de remontage : réaffiche les valeurs saisies après une erreur.
  const formKey = state.status === "error" ? JSON.stringify(values) : state.status;

  return (
    <form ref={formRef} key={formKey} action={formAction} noValidate className="grid gap-6">
      <div
        ref={statusRef}
        tabIndex={-1}
        role={state.status === "error" ? "alert" : "status"}
        className="outline-none empty:hidden"
      >
        {state.status === "success" ? (
          <p className="rounded-2xl bg-sauge-pale p-5 text-lg">{state.message}</p>
        ) : state.status === "error" ? (
          <p className="rounded-2xl border border-argile/40 bg-argile/5 p-5 text-lg text-argile-fonce">{state.message}</p>
        ) : null}
      </div>

      <p className="text-encre">
        Les champs marqués d&apos;un <span aria-hidden="true">*</span>
        <span className="sr-only">astérisque</span> sont obligatoires. Indiquez au moins un moyen de vous répondre.
      </p>

      <div>
        <label htmlFor="contact-name" className="font-medium">
          Votre nom <span className="font-normal text-encre">(facultatif)</span>
        </label>
        <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={120} defaultValue={values.name} className={inputClass} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="font-medium">
            E-mail
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass}
          />
          <FieldError id="contact-email-error" message={errors.email} />
        </div>
        <div>
          <label htmlFor="contact-phone" className="font-medium">
            Téléphone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            defaultValue={values.phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className={inputClass}
          />
          <FieldError id="contact-phone-error" message={errors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="font-medium">
          Sujet <span aria-hidden="true">*</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          defaultValue={values.subject ?? ""}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          className={inputClass}
        >
          <option value="" disabled>
            Choisissez un sujet
          </option>
          {Object.entries(CONTACT_SUBJECTS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <FieldError id="contact-subject-error" message={errors.subject} />
      </div>

      <div>
        <label htmlFor="contact-message" className="font-medium">
          Votre message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={2000}
          defaultValue={values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={`contact-message-hint${errors.message ? " contact-message-error" : ""}`}
          className={inputClass}
        />
        <p id="contact-message-hint" className="mt-2 text-sm text-encre">
          Merci de ne pas indiquer d&apos;informations de santé : nous en parlerons de vive voix si besoin.
        </p>
        <FieldError id="contact-message-error" message={errors.message} />
      </div>

      {/* Champ piège invisible pour les humains, rempli par certains robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Ne pas remplir ce champ</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div>
        <div className="flex items-start gap-3">
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            className="mt-1 h-5 w-5 shrink-0 accent-argile"
          />
          <label htmlFor="contact-consent">
            J&apos;accepte que mes coordonnées soient utilisées uniquement pour répondre à ma demande.{" "}
            <span aria-hidden="true">*</span>{" "}
            <Link href="/confidentialite" className="lien">
              En savoir plus sur vos données
            </Link>
          </label>
        </div>
        <FieldError id="contact-consent-error" message={errors.consent} />
      </div>

      <div>
        <Button type="submit" disabled={pending} aria-disabled={pending}>
          {pending ? "Envoi en cours…" : "Envoyer mon message"}
        </Button>
      </div>
    </form>
  );
}
