export async function fetchTeluguPreview(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const response = await fetch(
    `/api/admin/transliterate?text=${encodeURIComponent(trimmed)}`
  );

  if (!response.ok) return "";

  const data = (await response.json()) as { telugu?: string };
  return typeof data.telugu === "string" ? data.telugu : "";
}
