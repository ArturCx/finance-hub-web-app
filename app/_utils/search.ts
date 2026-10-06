export const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export const matchesSearch = (fields: (string | null | undefined)[], query: string) => {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalizeSearch(fields.filter(Boolean).join(" "));
  return terms.every((term) => haystack.includes(term));
};
