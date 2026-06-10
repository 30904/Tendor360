/**
 * Environment utility functions
 */

/**
 * Check if the application is running in development mode
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = () => {
  // Check multiple ways to determine if we're in development
  return (
    __DEV__ || 
    process.env.NODE_ENV === 'development' ||
    import.meta.env.DEV ||
    import.meta.env.MODE === 'development'
  )
}

/**
 * Check if the application is running in production mode
 * @returns {boolean} True if in production mode
 */
export const isProduction = () => {
  return !isDevelopment()
}

/**
 * Get the current environment mode
 * @returns {string} The current environment mode
 */
export const getEnvironment = () => {
  return isDevelopment() ? 'development' : 'production'
}
