import Sanscript from "@indic-transliteration/sanscript";

const TELUGU_SCRIPT = /[\u0C00-\u0C7F]/;

function isTeluguScript(text: string): boolean {
  return TELUGU_SCRIPT.test(text);
}

/** Prepare casual English/Roman spelling for ISO → Telugu (e.g. Raju → Rāju) */
function normalizeRomanWord(word: string): string {
  let normalized = word.trim();
  if (!normalized) return normalized;

  normalized = normalized
    .replace(/aa/gi, "ā")
    .replace(/ee/gi, "ī")
    .replace(/oo/gi, "ū")
    .replace(/ii/gi, "ī");

  if (/^rao$/i.test(normalized)) {
    return normalized[0] === "R" ? "Rāvu" : "rāvu";
  }

  const raPrefix = normalized.match(/^([Rr])a([\s\S]*)$/);
  if (raPrefix && !/^([Rr])ā/.test(normalized)) {
    return `${raPrefix[1]}ā${raPrefix[2]}`;
  }

  return normalized;
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
    .map((word) => Sanscript.t(normalizeRomanWord(word), "iso", "telugu"))
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
