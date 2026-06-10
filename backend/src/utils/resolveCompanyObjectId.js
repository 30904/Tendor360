const mongoose = require('mongoose');

/**
 * Normalize company id from req.user, JWT, or populated document.
 */
function resolveCompanyObjectId(raw) {
  if (!raw) return null;
  const id = raw._id || raw;
  if (!mongoose.Types.ObjectId.isValid(String(id))) return null;
  return new mongoose.Types.ObjectId(String(id));
}

module.exports = { resolveCompanyObjectId };
