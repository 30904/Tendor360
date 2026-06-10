/**
 * Utility functions for pagination
 */

/**
 * Get pagination parameters from request query
 * @param {Object} query - Request query object
 * @param {Object} options - Options for pagination
 * @returns {Object} Pagination parameters
 */
const getPagination = (query, options = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || options.defaultLimit || 20;
  const maxLimit = options.maxLimit || 100;
  
  // Ensure limit doesn't exceed maximum
  const finalLimit = Math.min(limit, maxLimit);
  
  // Calculate skip value
  const skip = (page - 1) * finalLimit;
  
  return {
    page,
    limit: finalLimit,
    skip,
  };
};

/**
 * Create pagination response object
 * @param {Array} data - Array of data items
 * @param {number} totalItems - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination response
 */
const createPaginationResponse = (data, totalItems, page, limit) => {
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(totalItems / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Validate pagination parameters
 * @param {Object} query - Request query object
 * @returns {Object} Validation result
 */
const validatePagination = (query) => {
  const errors = [];
  
  if (query.page && (isNaN(query.page) || parseInt(query.page) < 1)) {
    errors.push('Page must be a positive integer');
  }
  
  if (query.limit && (isNaN(query.limit) || parseInt(query.limit) < 1)) {
    errors.push('Limit must be a positive integer');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  getPagination,
  createPaginationResponse,
  validatePagination,
};
