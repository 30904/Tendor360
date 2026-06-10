/** Require authenticated buyer organization (issuer workspace). Run after requireAuth. */
const requireBuyer = (req, res, next) => {
  if (req.organizationKind !== 'buyer') {
    return res.status(403).json({
      success: false,
      error: 'Buyer organization required',
      message: 'This action is only available for issuing organizations.'
    });
  }
  next();
};

/** Require authenticated supplier organization (respondent portal). Run after requireAuth. */
const requireSupplier = (req, res, next) => {
  if (req.organizationKind !== 'supplier') {
    return res.status(403).json({
      success: false,
      error: 'Supplier organization required',
      message: 'This action is only available for participant organizations.'
    });
  }
  next();
};

module.exports = {
  requireBuyer,
  requireSupplier
};
