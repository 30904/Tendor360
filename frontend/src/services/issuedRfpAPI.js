import api from './authAPI'

export const issuedRfpAPI = {
  list: () => api.get('/issued-rfps'),
  getById: (id) => api.get(`/issued-rfps/${id}`),
  create: (body) => api.post('/issued-rfps', body),
  update: (id, body) => api.patch(`/issued-rfps/${id}`, body),
  publish: (id) => api.post(`/issued-rfps/${id}/publish`),
  createInvitation: (id, body) => api.post(`/issued-rfps/${id}/invitations`, body),
  listSubmissions: (id) => api.get(`/issued-rfps/${id}/submissions`)
}
