import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobSeekerEmail: { type: String, required: true },
  employerEmail: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing', required: true },
  appliedAt: { type: Date, default: Date.now }
});

// Add unique compound index to enforce that a job seeker cannot apply to the same job more than once
jobApplicationSchema.index({ jobSeekerEmail: 1, jobId: 1 }, { unique: true });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
