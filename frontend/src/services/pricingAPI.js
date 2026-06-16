import api from './authAPI';

export const getPricingScenarios = (params = {}) => {
  return api.get('/pricing', { params });
};

export const getTenderPricing = (tenderId) => {
  return api.get(`/pricing/tender/${tenderId}`);
};

export const createPricingScenario = (pricingData) => {
  return api.post('/pricing', pricingData);
};

export const updatePricingScenario = (id, updateData) => {
  return api.put(`/pricing/${id}`, updateData);
};

export const deletePricingScenario = (id) => {
  return api.delete(`/pricing/${id}`);
};

export const predictAIPricing = (tenderId) => {
  return api.post('/pricing/ai-predict', { tenderId });
};

const pricingAPI = {
  getPricingScenarios,
  getTenderPricing,
  createPricingScenario,
  updatePricingScenario,
  deletePricingScenario,
  predictAIPricing
};

export default pricingAPI;
