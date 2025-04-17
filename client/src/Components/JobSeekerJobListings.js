import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  useTheme
} from '@mui/material';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_JOB_LISTINGS = gql`
  query GetJobListings {
    getUserJobs {
      id
      jobTitle
      companyName
      jobDescription
      startDate
      endDate
      jobType
      email
    }
  }
`;

const GET_USER_EMAIL = gql`
  query GetUserEmail {
    users(page: 1, limit: 1) {
      users {
        email
        fullName
      }
    }
  }
`;

const GET_USER_APPLICATIONS = gql`
  query GetUserApplications($email: String!) {
    getApplicationsByUser(email: $email) {
      jobId
    }
  }
`;

const APPLY_TO_JOB = gql`
  mutation ApplyToJob($application: JobApplicationInput!) {
    applyToJob(application: $application) {
      id
      jobSeekerEmail
      employerEmail
      jobId
      appliedAt
    }
  }
`;

const JobSeekerJobListings = () => {
  const theme = useTheme();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userEmail = storedUser?.email || "Unknown";

  const { loading: jobLoading, error: jobError, data: jobData } = useQuery(GET_JOB_LISTINGS);
  const { loading: userLoading, error: userError } = useQuery(GET_USER_EMAIL);
  const { data: appliedData, loading: appliedLoading } = useQuery(GET_USER_APPLICATIONS, {
    variables: { email: userEmail },
    skip: !userEmail,
  });

  const [applyToJob] = useMutation(APPLY_TO_JOB);
  const [jobListings, setJobListings] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    if (jobData && jobData.getUserJobs) {
      const currentDate = new Date();
      const filtered = jobData.getUserJobs.filter((job) => {
        const jobStartDate = new Date(job.startDate);
        const jobEndDate = new Date(job.endDate);
        return jobStartDate <= currentDate && jobEndDate > currentDate;
      });
      setJobListings(filtered);
      setFilteredJobs(filtered);
    }
  }, [jobData]);

  const appliedJobIds = appliedData?.getApplicationsByUser?.map(app => app.jobId) || [];

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
  };

  const getDateDifference = (startDate) => {
    const currentDate = new Date();
    const jobStartDate = new Date(startDate);
    const timeDiff = currentDate - jobStartDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return '1 day ago';
    return `${daysDiff} days ago`;
  };

  const getDaysRemaining = (endDate) => {
    const currentDate = new Date();
    const jobEndDate = new Date(endDate);
    const timeDiff = jobEndDate - currentDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    if (daysDiff === 0) return 'Last day';
    if (daysDiff < 0) return 'Expired';
    return `${daysDiff} day(s) remaining`;
  };

  const handleApply = async (job) => {
    if (appliedJobIds.includes(job.id)) {
      setSnackbarMessage('You have already applied for this job.');
      setSnackbarOpen(true);
      return;
    }

    try {
      await applyToJob({
        variables: {
          application: {
            jobSeekerEmail: userEmail,
            employerEmail: job.email,
            jobId: job.id,
          },
        },
      });

      setSnackbarMessage('Successfully applied for the job!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('You have already applied for this job.');
      setSnackbarOpen(true);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    const filtered = jobListings.filter((job) =>
      job.jobTitle.toLowerCase().includes(lower) || job.companyName.toLowerCase().includes(lower)
    );
    setFilteredJobs(filtered);
  };

  const handleSort = (value) => {
    setSortBy(value);
    const sorted = [...filteredJobs];
    if (value === 'newest') {
      sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (value === 'oldest') {
      sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (value === 'title_az') {
      sorted.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
    } else if (value === 'title_za') {
      sorted.sort((a, b) => b.jobTitle.localeCompare(a.jobTitle));
    }
    setFilteredJobs(sorted);
  };

  if (jobLoading || userLoading || appliedLoading) return <CircularProgress />;
  if (jobError) return <p>Error loading job listings</p>;
  if (userError) return <p>Error loading user information</p>;

  return (
    <Box sx={{ px: 3, py: 5, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#005b96', textAlign: 'center', mb: 2 }}>
        Find Your Next Opportunity
      </Typography>
      <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 4 }}>
        Logged in as <strong>{userEmail}</strong>
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mb: 5 }}>
        <TextField
          label="Search job title or company"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
          sx={{ width: 350 }}
        />
        <FormControl sx={{ width: 220 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => handleSort(e.target.value)} label="Sort By">
            <MenuItem value="newest">Start Date (Newest)</MenuItem>
            <MenuItem value="oldest">Start Date (Oldest)</MenuItem>
            <MenuItem value="title_az">Job Title A-Z</MenuItem>
            <MenuItem value="title_za">Job Title Z-A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#004c99' }}>
                  {job.jobTitle}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#666' }}>
                  {job.companyName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>Type:</strong> {job.jobType}
                </Typography>
                <Typography variant="body2" sx={{ color: '#004c99' }}>
                  Posted: {getDateDifference(job.startDate)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#004c99' }}>
                  Ends: {getDaysRemaining(job.endDate)}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleViewDetails(job)}
                  sx={{ mb: 1, borderRadius: 2 }}
                >
                  View Details
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  disabled={appliedJobIds.includes(job.id)}
                  onClick={() => handleApply(job)}
                  sx={{ borderRadius: 2 }}
                >
                  {appliedJobIds.includes(job.id) ? 'Already Applied' : 'Apply'}
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>
              No job listings available right now.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#004c99', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
          Job Details
        </DialogTitle>
        <DialogContent sx={{ p: 4, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004c99' }}>
            {selectedJob?.jobTitle}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>{selectedJob?.companyName}</Typography>
          <Typography sx={{ mt: 3, color: '#444' }}>
            <strong>Description:</strong> {selectedJob?.jobDescription}
          </Typography>
          <Typography sx={{ mt: 2, color: '#444' }}>
            <strong>Type:</strong> {selectedJob?.jobType}
          </Typography>
          <Typography sx={{ mt: 2, color: '#444' }}>
            <strong>Start:</strong> {new Date(selectedJob?.startDate).toLocaleDateString()}
          </Typography>
          <Typography sx={{ mt: 2, color: '#444' }}>
            <strong>End:</strong> {new Date(selectedJob?.endDate).toLocaleDateString()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button onClick={handleCloseDialog} variant="contained" sx={{ borderRadius: 2, px: 4 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default JobSeekerJobListings;
