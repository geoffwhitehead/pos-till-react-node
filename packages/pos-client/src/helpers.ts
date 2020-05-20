export const resolvePrice = (priceGroup, prices) => prices.find(p => p.priceGroupId === priceGroup.id).price;
