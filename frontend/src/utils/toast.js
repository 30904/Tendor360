import { toast } from 'react-toastify';

// Toast utility functions for consistent messaging throughout the application
export const showToast = {
  // Success messages
  success: (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Error messages
  error: (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Warning messages
  warning: (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Info messages
  info: (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Loading messages
  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: "top-right",
      ...options
    });
  },

  // Dismiss loading toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  // Update existing toast
  update: (toastId, message, type = 'success', options = {}) => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 3000,
      ...options
    });
  }
};

// Common toast messages for CRUD operations
export const crudToasts = {
  // Create operations
  createSuccess: (itemName) => showToast.success(`${itemName} created successfully!`),
  createError: (itemName) => showToast.error(`Failed to create ${itemName}. Please try again.`),

  // Read operations
  loadSuccess: (itemName) => showToast.success(`${itemName} loaded successfully!`),
  loadError: (itemName) => showToast.error(`Failed to load ${itemName}. Please refresh the page.`),

  // Update operations
  updateSuccess: (itemName) => showToast.success(`${itemName} updated successfully!`),
  updateError: (itemName) => showToast.error(`Failed to update ${itemName}. Please try again.`),

  // Delete operations
  deleteSuccess: (itemName) => showToast.success(`${itemName} deleted successfully!`),
  deleteError: (itemName) => showToast.error(`Failed to delete ${itemName}. Please try again.`),

  // Validation errors
  validationError: (message) => showToast.error(`Validation Error: ${message}`),
  
  // Permission errors
  permissionError: () => showToast.error('You do not have permission to perform this action.'),
  
  // Network errors
  networkError: () => showToast.error('Network error. Please check your connection and try again.'),
  
  // Generic errors
  genericError: (message) => showToast.error(message || 'An unexpected error occurred. Please try again.')
};

// API response handler with automatic toast messages
export const handleApiResponse = (response, successMessage, errorMessage) => {
  if (response.success) {
    showToast.success(successMessage);
    return true;
  } else {
    showToast.error(errorMessage || response.message || 'Operation failed');
    return false;
  }
};

// API error handler with automatic toast messages
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const message = error.response?.data?.message || error.message || defaultMessage;
  showToast.error(message);
  console.error('API Error:', error);
};

export default showToast;
