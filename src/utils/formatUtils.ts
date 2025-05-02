
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getFinalCost = (service: any, clientService?: any) => {
  if (!service) return 0;
  
  // If it's already a number, return it
  if (typeof service === 'number') {
    return service;
  }
  
  // If it's a service object, get the cost
  const defaultCost = typeof service === 'object' ? service.defaultCost : 0;
  
  // If clientService has a custom cost, use that instead
  if (clientService && typeof clientService === 'object' && 
      clientService.customCost !== undefined && clientService.customCost !== null) {
    return clientService.customCost;
  }
  
  return defaultCost;
};
