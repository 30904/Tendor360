const mongoose = require('mongoose');

/**
 * Stores individual keywords parsed from the master Excel file.
 * Each keyword belongs to a companyId for multi-tenancy.
 */
const GlobalKeywordSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    source: {
      type: String,
      default: 'excel_upload'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per company
GlobalKeywordSchema.index({ companyId: 1, keyword: 1 }, { unique: true });

module.exports = mongoose.model('GlobalKeyword', GlobalKeywordSchema);
