import mongoose from 'mongoose';

// Define the schema for JobSeekerProfile
const jobSeekerProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  gender: { type: String },
  address: { type: String },
  nationality: { type: String },
  languages: { type: String },
  experience: [{
    startDate: { type: String },
    endDate: { type: String },
    jobTitle: { type: String },
    companyName: { type: String },
    description: { type: String },
  }],
  education: [{
    degree: { type: String },
    institution: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String },
  }],
});

// Create a model using the schema
const JobSeekerProfile = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);

export { JobSeekerProfile };
