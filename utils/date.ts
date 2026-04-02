const HAS_TIMEZONE_RE = /([zZ]|[+-]\d\d:\d\d)$/;

export const parseApiDate = (value?: string | number | Date | null): Date | null => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = HAS_TIMEZONE_RE.test(trimmed) ? trimmed : `${trimmed}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatApiDate = (value?: string | number | Date | null, fallback = 'N/A'): string => {
  const date = parseApiDate(value);
  return date ? date.toLocaleDateString() : fallback;
};

export const formatApiDateTime = (value?: string | number | Date | null, fallback = 'N/A'): string => {
  const date = parseApiDate(value);
  return date ? date.toLocaleString() : fallback;
};
