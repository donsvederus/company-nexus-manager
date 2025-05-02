export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getFinalCost = (defaultCost: number, customCost?: number) => {
  // If customCost is explicitly set (even to 0), use that value
  if (customCost !== undefined && customCost !== null) {
    return customCost;
  }
  
  // Otherwise use the default cost
  return defaultCost;
};
