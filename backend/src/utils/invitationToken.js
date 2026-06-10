const crypto = require('crypto')

function hashInvitationToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken, 'utf8').digest('hex')
}

function generateInvitationToken() {
  return crypto.randomBytes(32).toString('base64url')
}

module.exports = {
  hashInvitationToken,
  generateInvitationToken
}
