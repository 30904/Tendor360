import api from './authAPI'

export const respondAPI = {
  listInvitations: () => api.get('/respond/invitations'),
  redeem: (token) => api.post('/respond/invitations/redeem', { token }),
  getIssuedRfp: (id) => api.get(`/respond/issued-rfps/${id}`),
  acceptTerms: (id, version) =>
    api.post(`/respond/issued-rfps/${id}/accept-terms`, { version }),
  getSubmission: (issuedRfpId) =>
    api.get(`/respond/issued-rfps/${issuedRfpId}/submission`),
  updateSubmission: (submissionId, body) =>
    api.patch(`/respond/submissions/${submissionId}`, body),
  submitProposal: (submissionId) =>
    api.post(`/respond/submissions/${submissionId}/submit`)
}
