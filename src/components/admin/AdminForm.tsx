"use client";

import { createContext, use, useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { idleState, type AdminFormState } from "@/lib/admin/form-state";
import { buttonClasses } from "@/components/ui/Button";

type Action = (previous: AdminFormState, formData: FormData) => Promise<AdminFormState>;

const FormStateContext = createContext<AdminFormState>(idleState);

/** Erreur et valeur saisie d'un champ, pour réafficher le formulaire après une erreur. */
export function useField(name: string, defaultValue?: string) {
  const state = use(FormStateContext);
  if (state.status !== "error") return { error: undefined, value: defaultValue };
  return { error: state.fieldErrors[name], value: name in state.values ? state.values[name] : defaultValue };
}

export function useFormResult() {
  return use(FormStateContext);
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses("primary")}>
      {pending ? "Enregistrement…" : label}
    </button>
  );
}

type AdminFormProps = {
  action: Action;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
};

export function AdminForm({ action, children, submitLabel = "Enregistrer", className = "" }: AdminFormProps) {
  const [state, formAction] = useActionState(action, idleState);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "idle") messageRef.current?.focus();
  }, [state]);

  // Remonte le formulaire après chaque réponse pour appliquer les valeurs renvoyées.
  const key = state.status === "error" ? JSON.stringify(state.values) : state.status;

  return (
    <FormStateContext value={state}>
      <form key={key} action={formAction} noValidate className={`grid gap-6 ${className}`}>
        <div ref={messageRef} tabIndex={-1} role={state.status === "error" ? "alert" : "status"} className="outline-none empty:hidden">
          {state.status === "success" ? (
            <p className="rounded-xl bg-sauge-pale px-4 py-3">{state.message}</p>
          ) : state.status === "error" ? (
            <p className="rounded-xl border border-argile/40 bg-argile/5 px-4 py-3 text-argile-fonce">{state.message}</p>
          ) : null}
        </div>
        {children}
        <div className="sticky bottom-0 -mx-4 border-t border-nuit/10 bg-lin/95 px-4 py-4 sm:-mx-6 sm:px-6">
          <SubmitButton label={submitLabel} />
        </div>
      </form>
    </FormStateContext>
  );
}
