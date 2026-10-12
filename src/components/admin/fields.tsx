"use client";

import { useId, type ReactNode } from "react";
import { useField } from "./AdminForm";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-nuit/30 bg-white px-3 py-2.5 text-base text-nuit aria-[invalid=true]:border-argile";

type BaseProps = { name: string; label: string; hint?: string; required?: boolean };

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
        {required ? <span className="text-argile"> *</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-encre">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-medium text-argile">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function TextField({
  name,
  label,
  hint,
  required,
  defaultValue = "",
  type = "text",
  maxLength,
  autoComplete,
}: BaseProps & { defaultValue?: string; type?: "text" | "email" | "tel" | "url" | "number" | "time" | "password"; maxLength?: number; autoComplete?: string }) {
  const id = useId();
  const { error, value } = useField(name, defaultValue);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={type === "password" ? undefined : value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function TextArea({
  name,
  label,
  hint,
  required,
  defaultValue = "",
  maxLength,
  rows = 4,
}: BaseProps & { defaultValue?: string; maxLength?: number; rows?: number }) {
  const id = useId();
  const { error, value } = useField(name, defaultValue);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={value}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  hint,
  required,
  defaultValue = "",
  options,
}: BaseProps & { defaultValue?: string; options: { value: string; label: string }[] }) {
  const id = useId();
  const { error, value } = useField(name, defaultValue);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        name={name}
        defaultValue={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({ name, label, hint, defaultChecked = false }: BaseProps & { defaultChecked?: boolean }) {
  const id = useId();
  const { error, value } = useField(name, defaultChecked ? "on" : "");
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={value === "on"}
          aria-describedby={describedBy(id, hint, error)}
          className="h-5 w-5 accent-argile"
        />
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="ml-8 mt-1 text-sm text-encre">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="ml-8 mt-1 text-sm font-medium text-argile">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FileField({ name, label, hint, required, accept }: BaseProps & { accept: string }) {
  const id = useId();
  const { error } = useField(name);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-sable file:px-4 file:py-2`}
      />
    </FieldShell>
  );
}
