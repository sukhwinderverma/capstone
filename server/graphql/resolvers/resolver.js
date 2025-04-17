import { JobSeekerProfile } from "../../model/jobSeekerProfile.js";
import { EmployerProfile } from "../../model/employerProfile.js";
import { User } from "../../model/user.js";
import { JobListing } from "../../model/jobListing.js";
import { JobApplication } from "../../model/jobApplication.js";
import mongoose from "mongoose";
import { ApolloError } from "apollo-server-errors";

const JobApplicationResponse = {
  success: Boolean,
  message: String
};

export const resolvers = {
  Query: {
    verifyUser: async (_, { fullName, email }) => {
      try {
        const user = await User.findOne({ fullName, email });
        if (!user) {
          return {
            success: false,
            message: "No user found with this name and email combination",
          };
        }
        return { success: true, message: "User verified successfully" };
      } catch (err) {
        throw new Error("Error verifying user: " + err.message);
      }
    },
    users: async (_, { page = 1, limit = 10 }) => {
      try {
        const skip = (page - 1) * limit;
        const totalUsers = await User.countDocuments();
        const users = await User.find().skip(skip).limit(limit);
  
        return {
          users: users.map(user => ({
            ...user.toObject(),
            id: user._id.toString(),
          })),
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
        };
      } catch (err) {
        throw new Error("Error fetching users: " + err.message);
      }
    },
    getUserJobs: async () => {
      try {
        const jobListings = await JobListing.find();
        return jobListings.map(job => ({
          ...job.toObject(),
          id: job._id.toString(),
        }));
      } catch (err) {
        throw new Error('Error fetching job listings: ' + err.message);
      }
    },
    getJobDetails: async (_, { id }) => {
      try {
        const job = await JobListing.findById(id);
        if (!job) throw new Error("Job not found");

        return { ...job.toObject(), id: job._id.toString() };
      } catch (err) {
        throw new Error("Error fetching job details: " + err.message);
      }
    },

    // Get all job listings with pagination and an optional email filter
    getJobListings: async (_, { page = 1, limit = 10, email = "" }) => {
      try {
        const skip = (page - 1) * limit;
        const totalJobListings = await JobListing.countDocuments();

        let jobListings;
        
        if (email) {
          // If email is provided, filter by email to get the employer's job listings
          jobListings = await JobListing.find({ email }).skip(skip).limit(limit);
        } else {
          // Otherwise, fetch all job listings
          jobListings = await JobListing.find().skip(skip).limit(limit);
        }

        return {
          jobListings: jobListings.map(job => ({
            ...job.toObject(),
            id: job._id.toString(),
          })),
          totalPages: Math.ceil(totalJobListings / limit),
          currentPage: page,
        };
      } catch (err) {
        throw new Error("Error fetching job listings: " + err.message);
      }
    },

    getJobListingsByEmail: async (_, { email }) => {
      try {
        const jobListings = await JobListing.find({ email });
        return jobListings.map(job => ({
          ...job.toObject(),
          id: job._id.toString(),
        }));
      } catch (err) {
        throw new Error('Error fetching job listings by email: ' + err.message);
      }
    },

    getEmployerProfileByEmail: async (_, { email }) => {
      try {
        const profile = await EmployerProfile.findOne({ employerEmail: email });
        if (!profile) throw new Error("Employer profile not found");
        return profile;
      } catch (err) {
        throw new Error("Error fetching employer profile: " + err.message);
      }
    },

    getJobSeekerProfileByEmail: async (_, { email }) => {
      try {
        const normalizedEmail = email.trim().toLowerCase();
        const profile = await JobSeekerProfile.findOne({ email: normalizedEmail });
        if (!profile) return null;

        if (!profile.name) {
          throw new ApolloError("Job Seeker profile name is missing", "PROFILE_NAME_MISSING");
        }

        return profile;
      } catch (err) {
        throw new ApolloError("Error fetching job seeker profile: " + err.message, "PROFILE_FETCH_ERROR");
      }
    },

    getAllJobApplications: async () => {
      try {
        const applications = await JobApplication.find();
        return applications.map((application) => ({
          ...application.toObject(),
          id: application._id.toString(),
        }));
      } catch (err) {
        throw new Error("Error fetching job applications: " + err.message);
      }
    },

    getJobApplicationsByJobSeekerEmail: async (_, { email }) => {
      try {
        const applications = await JobApplication.find({ jobSeekerEmail: email });
        return applications.map((application) => ({
          ...application.toObject(),
          id: application._id.toString(),
        }));
      } catch (err) {
        throw new Error("Error fetching job applications for job seeker: " + err.message);
      }
    },
  },

  Mutation: {
    signup: async (_, { fullName, email, password, userType }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("User already exists with this email");

        const newUser = new User({
          fullName,
          email,
          password,
          userType,
          blocked: false,
        });

        await newUser.save();
        return newUser;
      } catch (err) {
        throw new Error("Error signing up: " + err.message);
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("No user found with this email");

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error("Incorrect password");

        return {
          message: "Login successful",
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            blocked: user.blocked,
          },
        };
      } catch (err) {
        throw new Error("Error logging in: " + err.message);
      }
    },

    resetPassword: async (_, { email, newPassword }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            success: false,
            message: "No user found with this email",
          };
        }

        user.password = newPassword;
        await user.save();

        return {
          success: true,
          message: "Password reset successfully.",
        };
      } catch (err) {
        throw new Error("Error resetting password: " + err.message);
      }
    },

    blockUser: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) throw new Error("User not found");

        user.blocked = !user.blocked;
        await user.save();
        return user;
      } catch (err) {
        throw new Error("Error blocking/unblocking user: " + err.message);
      }
    },

    createJobSeekerProfile: async (_, { name, email, mobile, gender, address, nationality, languages, experience, education }) => {
      try {
        const newProfile = new JobSeekerProfile({
          name,
          email,
          mobile,
          gender,
          address,
          nationality,
          languages,
          experience,
          education,
        });

        await newProfile.save();
        return newProfile;
      } catch (err) {
        throw new Error("Error creating job seeker profile: " + err.message);
      }
    },

    updateJobSeekerProfile: async (_, { id, name, email, mobile, gender, address, nationality, languages, experience, education }) => {
      try {
        let profile = await JobSeekerProfile.findById(id);
        if (!profile) {
          profile = new JobSeekerProfile({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            mobile,
            gender,
            address,
            nationality,
            languages,
            experience,
            education,
          });
          await profile.save();
          return profile;
        }

        profile.name = name;
        profile.email = email;
        profile.mobile = mobile;
        profile.gender = gender;
        profile.address = address;
        profile.nationality = nationality;
        profile.languages = languages;
        profile.experience = experience;
        profile.education = education;

        await profile.save();
        return profile;
      } catch (err) {
        throw new Error("Error updating or creating job seeker profile: " + err.message);
      }
    },

    createEmployerProfile: async (_, { employerName, companyName, aboutCompany, companyStartDate, location, employerEmail }) => {
      try {
        const newProfile = new EmployerProfile({
          employerName,
          companyName,
          aboutCompany,
          companyStartDate,
          location,
          employerEmail,
        });

        await newProfile.save();
        return newProfile;
      } catch (err) {
        throw new Error("Error creating employer profile");
      }
    },

    updateEmployerProfile: async (_, { id, employerName, companyName, aboutCompany, companyStartDate, location }) => {
      try {
        const profile = await EmployerProfile.findById(id);
        if (!profile) throw new Error("Employer profile not found");

        if (employerName) profile.employerName = employerName;
        if (companyName) profile.companyName = companyName;
        if (aboutCompany) profile.aboutCompany = aboutCompany;
        if (companyStartDate) profile.companyStartDate = companyStartDate;
        if (location) profile.location = location;

        await profile.save();
        return profile;
      } catch (err) {
        throw new Error("Error updating employer profile: " + err.message);
      }
    },

    createJobListing: async (_, { jobTitle, companyName, jobDescription, startDate, endDate, jobType, userId, email }) => {
      try {
        const newListing = new JobListing({
          jobTitle,
          companyName,
          jobDescription,
          startDate,
          endDate,
          jobType,
          userId,
          email,
        });

        await newListing.save();
        return newListing;
      } catch (err) {
        throw new Error("Error creating job listing: " + err.message);
      }
    },

    updateJobListing: async (_, { id, jobTitle, companyName, jobDescription, startDate, endDate, jobType, email }) => {
      try {
        const updateFields = {
          jobTitle,
          companyName,
          jobDescription,
          startDate,
          endDate,
          jobType,
          email,
        };

        Object.keys(updateFields).forEach((key) => {
          if (updateFields[key] === undefined) delete updateFields[key];
        });

        const updatedJob = await JobListing.findByIdAndUpdate(id, updateFields, {
          new: true,
        });

        if (!updatedJob) throw new Error("Job listing not found");

        return updatedJob;
      } catch (err) {
        throw new Error("Error updating job listing: " + err.message);
      }
    },

    deleteJobListing: async (_, { id }) => {
      try {
        const deleted = await JobListing.findByIdAndDelete(id);
        if (!deleted) throw new Error("Job listing not found");
        return "Job listing deleted successfully";
      } catch (err) {
        throw new ApolloError("Error deleting job listing: " + err.message);
      }
    },

    applyToJob: async (_, { application }) => {
      const { jobSeekerEmail, employerEmail, jobId } = application;

      try {
        const existing = await JobApplication.findOne({ jobSeekerEmail, jobId });
        if (existing) {
          throw new Error("Already applied to this job");
        }

        const newApp = new JobApplication({
          jobSeekerEmail,
          employerEmail,
          jobId,
        });

        await newApp.save();
        return newApp;
      } catch (err) {
        throw new Error("Error applying to job: " + err.message);
      }
    },

    deleteJobApplication: async (_, { id }) => {
      try {
        const deletedApplication = await JobApplication.findByIdAndDelete(id);

        if (!deletedApplication) {
          throw new ApolloError("Job application not found", "APPLICATION_NOT_FOUND");
        }

        return {
          success: true,
          message: "Job application deleted successfully",
        };
      } catch (err) {
        throw new ApolloError("Error deleting job application: " + err.message, "DELETE_ERROR");
      }
    },
  },

  JobApplication: {
    job: async (parent) => {
      try {
        const job = await JobListing.findById(parent.jobId);
        return job ? { ...job.toObject(), id: job._id.toString() } : null;
      } catch (err) {
        throw new ApolloError("Error fetching job details for application: " + err.message);
      }
    },

    jobSeekerProfile: async (parent) => {
      try {
        const profile = await JobSeekerProfile.findOne({ email: parent.jobSeekerEmail });
        return profile ? { ...profile.toObject(), id: profile._id.toString() } : null;
      } catch (err) {
        throw new ApolloError("Error fetching job seeker profile: " + err.message);
      }
    },
  },
};
