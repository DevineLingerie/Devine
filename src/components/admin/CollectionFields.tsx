import type { FieldDef } from "@/lib/admin/collections";
import { CheckboxField, SelectField, TextArea, TextField } from "./fields";

type CollectionFieldsProps = {
  fields: FieldDef[];
  values: Record<string, string | boolean>;
  mediaOptions: { value: string; label: string }[];
};

/** Champs d'un élément de collection, générés à partir de sa définition. */
export function CollectionFields({ fields, values, mediaOptions }: CollectionFieldsProps) {
  return (
    <div className="grid gap-5 rounded-2xl border border-nuit/10 bg-white/40 p-5 sm:p-6">
      {fields.map((field) => {
        const value = values[field.name];
        const common = { name: field.name, label: field.label, hint: field.hint, required: field.required };
        switch (field.type) {
          case "checkbox":
            return <CheckboxField key={field.name} {...common} defaultChecked={value === true} />;
          case "textarea":
            return <TextArea key={field.name} {...common} defaultValue={String(value ?? "")} maxLength={field.maxLength} />;
          case "select":
            return <SelectField key={field.name} {...common} defaultValue={String(value ?? "")} options={field.options ?? []} />;
          case "media":
            return <SelectField key={field.name} {...common} defaultValue={String(value ?? "")} options={mediaOptions} />;
          case "number":
            return <TextField key={field.name} {...common} type="number" defaultValue={String(value ?? "0")} />;
          default:
            return <TextField key={field.name} {...common} defaultValue={String(value ?? "")} maxLength={field.maxLength} />;
        }
      })}
    </div>
  );
}
