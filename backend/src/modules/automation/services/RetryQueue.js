const AutomationJob = require('../models/AutomationJob');
const AutomationFailure = require('../models/AutomationFailure');
const AutomationLog = require('../models/AutomationLog');

class RetryQueue {
  async enqueue({ companyId, jobType, payload, scheduledAt, maxAttempts = 3 }) {
    return AutomationJob.create({
      companyId,
      jobType,
      payload,
      scheduledAt: scheduledAt || new Date(),
      maxAttempts
    });
  }

  async markFailed(job, error) {
    job.attempts += 1;
    job.errorMessage = error.message;
    job.status = job.attempts >= job.maxAttempts ? 'failed' : 'retrying';
    job.completedAt = job.status === 'failed' ? new Date() : undefined;
    await job.save();

    await AutomationFailure.create({
      companyId: job.companyId,
      jobId: job._id,
      errorMessage: error.message,
      stack: error.stack,
      retryable: job.status === 'retrying'
    });

    await AutomationLog.create({
      companyId: job.companyId,
      jobId: job._id,
      level: 'error',
      message: error.message
    });
  }

  async listRetryable(companyId, limit = 20) {
    return AutomationJob.find({
      companyId,
      status: { $in: ['queued', 'retrying', 'failed'] }
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
  }
}

module.exports = new RetryQueue();
