// Vietnamese text can place a tone mark on either vowel of a diphthong
// ("Hòa" vs "Hoà"), and mobile keyboards often differ from desktop.
// Stripping diacritics makes search match regardless of tone placement,
// and also lets users type without diacritics at all ("hoa phat").
export const normalizeSearchText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
