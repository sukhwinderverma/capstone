import mongoose from 'mongoose';

const employerProfileSchema = new mongoose.Schema({
  employerName: { type: String, required: true },
  companyName: { type: String, required: true },
  aboutCompany: { type: String, required: true },
  companyStartDate: { type: String, required: true },
  location: { type: String, required: true },
  employerEmail: { type: String, required: true },
});

export const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);
