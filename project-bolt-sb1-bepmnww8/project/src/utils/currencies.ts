export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  decimals: number;
}

export const currencies: Currency[] = [
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    decimals: 2
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    decimals: 2
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    decimals: 2
  },
  {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    flag: '🇨🇭',
    decimals: 2
  },
  {
    code: 'CAD',
    symbol: 'CAD',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    decimals: 2
  },
  {
    code: 'AUD',
    symbol: 'AUD',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    decimals: 2
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    decimals: 0
  }
];

export const getCurrencyByCode = (code: string): Currency => {
  return currencies.find(currency => currency.code === code) || currencies[0];
};

export const formatAmount = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  
  if (currency.decimals === 0) {
    return `${currency.symbol}${Math.round(amount)}`;
  }
  
  // For currencies with symbols that go after the amount
  if (['CHF', 'CAD', 'AUD'].includes(currency.code)) {
    return `${amount.toFixed(currency.decimals)} ${currency.symbol}`;
  }
  
  return `${currency.symbol}${amount.toFixed(currency.decimals)}`;
};

export const getCurrencyInputPadding = (currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  // For 3-letter currency codes, use more left padding
  if (['CHF', 'CAD', 'AUD'].includes(currency.code)) {
    return 'pl-16';
  }
  // For single character symbols
  return 'pl-8';
};