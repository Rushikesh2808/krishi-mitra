/**
 * Utility functions for Indian Rupee (₹) and quantitative agricultural units formatting
 */

export const formatINR = (amount: number, showDecimals: boolean = false): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
};

export const formatQuintals = (quintals: number): string => {
  if (isNaN(quintals)) return '0 Qtl';
  return `${new Intl.NumberFormat('en-IN').format(quintals)} Qtl`;
};

export const formatPerQuintal = (amount: number): string => {
  return `${formatINR(amount)}/Qtl`;
};

