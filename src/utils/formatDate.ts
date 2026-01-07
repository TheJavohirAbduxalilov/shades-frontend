const normalizeLocale = (locale: string) => {
  if (locale === 'uz_cyrl') {
    return 'uz-Cyrl-UZ';
  }
  if (locale === 'uz_latn') {
    return 'uz-Latn-UZ';
  }
  return locale;
};

export const formatDate = (value: string, locale = 'ru-RU') => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(normalizeLocale(locale));
};
