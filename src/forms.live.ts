// The forms' links and question ids, as the sheet's web app serves them (data.forms, from apps-script/Code.gs →
// siteForms_()). A new map never copies form links into the code: once the sheet has built its forms, the site
// picks them up from the data. forms.config.ts and forms.fields.json are only the fallback for older sheets.
import STATIC_FIELDS from "./forms.fields.json";
import { FORMS, type FormLink } from "./forms.config";
import type { DataFile } from "./types";

export type FormField = { entry: string; type: number; choices?: string[] };
export type FormFields = Record<string, Record<string, FormField>>;

/** Question title → its "entry.N" id, type and choices, per form. Filled from data.forms when the sheet sends it. */
export const FIELDS: FormFields = { ...(STATIC_FIELDS as FormFields) };

/** Use the sheet's own form links and question ids (call once the data has loaded). */
export function applyLiveForms(forms: DataFile["forms"]): void {
  if (!forms) return;
  for (const k of Object.keys(FORMS) as (keyof typeof FORMS)[]) {
    const live: Partial<FormLink> | undefined = forms.links?.[k];
    if (live?.url) FORMS[k] = { ...live, url: live.url };
  }
  for (const [k, f] of Object.entries(forms.fields || {})) if (f && Object.keys(f).length) FIELDS[k] = f;
}
