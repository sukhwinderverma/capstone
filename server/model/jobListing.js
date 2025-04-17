import mongoose from 'mongoose';

// Define the JobListing schema
const jobListingSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  jobDescription: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  jobType: { type: String, required: true },
  email: { type: String, required: true },
  
  // Link to the User model by userId
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Create the JobListing model from the schema
export const JobListing = mongoose.model('JobListing', jobListingSchema);
