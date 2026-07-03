import Sanscript from "@indic-transliteration/sanscript";

const TELUGU_SCRIPT = /[\u0C00-\u0C7F]/;

function isTeluguScript(text: string): boolean {
  return TELUGU_SCRIPT.test(text);
}

/** Roman (ISO 15919) → Telugu script; passthrough if already Telugu */
export function toTelugu(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";

  if (isTeluguScript(trimmed)) {
    return trimmed;
  }

  return trimmed
    .split(/\s+/)
    .map((word) => Sanscript.t(word, "iso", "telugu"))
    .join(" ");
}

export function withTeluguNames<T extends { name: string; aliasName: string; fatherName: string }>(
  data: T
): T & { nameTe: string; aliasNameTe: string; fatherNameTe: string } {
  return {
    ...data,
    nameTe: toTelugu(data.name),
    aliasNameTe: toTelugu(data.aliasName),
    fatherNameTe: toTelugu(data.fatherName),
  };
}
