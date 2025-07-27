/**
 * Verilen bir sayıyı Dolar ($) formatında bir metne çevirir.
 * Örn: 123.456 -> "$123.46"
 * @param amount Biçimlendirilecek sayı.
 * @returns Dolar formatında metin.
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};