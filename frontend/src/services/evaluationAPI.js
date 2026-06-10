import api from './authAPI';

// Evaluation CRUD operations
export const getEvaluations = (params = {}) => {
  return api.get('/evaluations', { params });
};

export const getEvaluation = (id) => {
  return api.get(`/evaluations/${id}`);
};

export const createEvaluation = (evaluationData) => {
  return api.post('/evaluations', evaluationData);
};

export const updateEvaluation = (id, updateData) => {
  return api.put(`/evaluations/${id}`, updateData);
};

export const deleteEvaluation = (id) => {
  return api.delete(`/evaluations/${id}`);
};

// Evaluation workflow operations
export const submitForReview = (id, reviewData) => {
  return api.post(`/evaluations/${id}/submit`, reviewData);
};

export const reviewEvaluation = (id, reviewData) => {
  return api.post(`/evaluations/${id}/review`, reviewData);
};

export const makeDecision = (id, decisionData) => {
  return api.post(`/evaluations/${id}/decision`, decisionData);
};

// Statistics and dashboard data
export const getEvaluationStats = () => {
  return api.get('/evaluations/stats');
};

export const getQuickDecisions = () => {
  return api.get('/evaluations/quick-decisions');
};

// Template operations
export const getEvaluationTemplates = (params = {}) => {
  return api.get('/evaluations/templates', { params });
};

export const createEvaluationTemplate = (templateData) => {
  return api.post('/evaluations/templates', templateData);
};

export const cloneEvaluationTemplate = (id, cloneData) => {
  return api.post(`/evaluations/templates/${id}/clone`, cloneData);
};

// Export as default object for Redux thunks
const evaluationAPI = {
  getEvaluations,
  getEvaluation,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  submitForReview,
  reviewEvaluation,
  makeDecision,
  getEvaluationStats,
  getQuickDecisions,
  getEvaluationTemplates,
  createEvaluationTemplate,
  cloneEvaluationTemplate
};

export default evaluationAPI;
