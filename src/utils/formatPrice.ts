export const formatPrice = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }

  const formatted = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(value);

  return formatted.replace(new RegExp('\u00a0', 'g'), ' ');
};
