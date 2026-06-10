// User Roles
const ROLES = {
  SYSTEM_ADMINISTRATOR: 'SYSTEM ADMINISTRATOR',
  ADMIN: 'ADMIN',
  TENDER_MANAGER: 'TENDER MANAGER',
  REVIEWER: 'REVIEWER',
  APPROVER: 'APPROVER',
  PRICING_ANALYST: 'PRICING ANALYST',
  GUEST: 'GUEST'
};

// Tender Status
const TENDER_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  EVALUATING: 'EVALUATING',
  AWARDED: 'AWARDED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED'
};

// Document Status
const DOCUMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED'
};

// Evaluation Decision
const EVALUATION_DECISION = {
  BID: 'BID',
  NO_BID: 'NO_BID',
  PENDING: 'PENDING'
};

// Notification Types
const NOTIFICATION_TYPES = {
  TENDER_DEADLINE: 'TENDER_DEADLINE',
  TASK_OVERDUE: 'TASK_OVERDUE',
  EVALUATION_COMPLETE: 'EVALUATION_COMPLETE',
  DOCUMENT_UPLOAD: 'DOCUMENT_UPLOAD',
  SYSTEM_ALERT: 'SYSTEM_ALERT'
};

// File Types
const FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  IMAGE: 'image/*'
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// JWT Token Types
const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh'
};

module.exports = {
  ROLES,
  TENDER_STATUS,
  DOCUMENT_STATUS,
  EVALUATION_DECISION,
  NOTIFICATION_TYPES,
  FILE_TYPES,
  PAGINATION,
  TOKEN_TYPES
};
