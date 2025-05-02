
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getFinalCost = (defaultCost: number, customCost?: number) => {
  return customCost !== undefined ? customCost : defaultCost;
};
