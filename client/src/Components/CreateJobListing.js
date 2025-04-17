import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Grid, Paper, List, ListItem, ListItemText, IconButton, Tooltip } from '@mui/material';
import { gql, useMutation, useQuery, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const GRAPHQL_URL = "https://capstone-server2-2qh1.onrender.com/graphql";

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const GET_JOB_LISTINGS_BY_EMAIL = gql`
  query GetJobListingsByEmail($email: String!) {
    getJobListingsByEmail(email: $email) {
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

const CREATE_JOB_LISTING = gql`
  mutation CreateJobListing(
    $jobTitle: String!,
    $companyName: String!,
    $jobDescription: String!,
    $startDate: String!,
    $endDate: String!,
    $jobType: String!,
    $userId: ID!,
    $email: String!,
  ) {
    createJobListing(
      jobTitle: $jobTitle,
      companyName: $companyName,
      jobDescription: $jobDescription,
      startDate: $startDate,
      endDate: $endDate,
      jobType: $jobType,
      userId: $userId,
      email: $email,
    ) {
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

const DELETE_JOB_LISTING = gql`
  mutation DeleteJobListing($id: ID!) {
    deleteJobListing(id: $id)
  }
`;

const UPDATE_JOB_LISTING = gql`
  mutation UpdateJobListing(
    $id: ID!,
    $jobTitle: String,
    $companyName: String,
    $jobDescription: String,
    $startDate: String,
    $endDate: String,
    $jobType: String,
    $email: String,
  ) {
    updateJobListing(
      id: $id,
      jobTitle: $jobTitle,
      companyName: $companyName,
      jobDescription: $jobDescription,
      startDate: $startDate,
      endDate: $endDate,
      jobType: $jobType,
      email: $email,
    ) {
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

export default function CreateJobListing() {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [email, setEmail] = useState('');
  const [jobType, setJobType] = useState('Full-Time');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    startDate: '',
    endDate: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  const { loading: queryLoading, error: queryError, data: queryData, refetch } = useQuery(GET_JOB_LISTINGS_BY_EMAIL, {
    variables: { email: user?.email },
    client,
  });

  const [createJobListing, { loading: createLoading }] = useMutation(CREATE_JOB_LISTING, {
    onCompleted: () => {
      refetch();
    },
    client,
  });

  const [deleteJobListing] = useMutation(DELETE_JOB_LISTING, {
    onCompleted: () => {
      refetch();
    },
    client,
  });

  const [updateJobListing, { loading: updateLoading }] = useMutation(UPDATE_JOB_LISTING, {
    onCompleted: () => {
      refetch();
    },
    client,
  });

  useEffect(() => {
    if (editingJob) {
      setJobTitle(editingJob.jobTitle);
      setCompanyName(editingJob.companyName);
      setJobDescription(editingJob.jobDescription);
      setStartDate(editingJob.startDate);
      setEndDate(editingJob.endDate);
      setJobType(editingJob.jobType);
      setEmail(editingJob.email);
    } else {
      setJobTitle('');
      setCompanyName('');
      setJobDescription('');
      setStartDate('');
      setEndDate('');
      setJobType('Full-Time');
      setEmail('');
    }
  }, [editingJob]);

  const validateFields = () => {
    let valid = true;
    const newErrors = {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      startDate: '',
      endDate: ''
    };
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
      valid = false;
    }
  
    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
      valid = false;
    }
  
    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
      valid = false;
    }
  
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
      valid = false;
    } else {
      const selectedStartDate = new Date(startDate);
      selectedStartDate.setHours(0, 0, 0, 0);
      if (selectedStartDate < yesterday) {
        newErrors.startDate = 'Start date cannot be earlier than today';
        valid = false;
      }
    }
  
    if (!endDate) {
      newErrors.endDate = 'End date is required';
      valid = false;
    } else {
      const selectedEndDate = new Date(endDate);
      selectedEndDate.setHours(0, 0, 0, 0);
      if (selectedEndDate < yesterday) {
        newErrors.endDate = 'End date cannot be earlier than today';
        valid = false;
      }
    }
  
    setErrors(newErrors);
    return valid;
  };
  
  const clearFormFields = () => {
    setJobTitle('');
    setCompanyName('');
    setJobDescription('');
    setStartDate('');
    setEndDate('');
    setJobType('Full-Time');
    setEmail('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setSuccessMessage('Please fix all validation errors');
      setOpenSnackbar(true);
      return;
    }

    if (!user) {
      setSuccessMessage('User is not logged in');
      return;
    }

    try {
      const emailToUse = user.email;

      if (editingJob) {
        await updateJobListing({
          variables: {
            id: editingJob.id,
            jobTitle,
            companyName,
            jobDescription,
            startDate,
            endDate,
            jobType,
            email: emailToUse,
          },
        });
        setSuccessMessage('Job Listing updated successfully!');
      } else {
        await createJobListing({
          variables: {
            jobTitle,
            companyName,
            jobDescription,
            startDate,
            endDate,
            jobType,
            userId: user.id,
            email: emailToUse,
          },
        });
        setSuccessMessage('Job Listing created successfully!');
      }
      setEditingJob(null);
      setOpenSnackbar(true);
      clearFormFields();
    } catch (err) {
      setSuccessMessage(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJobListing({ variables: { id } });
    } catch (err) {
      console.error('Error deleting job listing:', err.message);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getJobStatus = (endDate) => {
    const today = new Date();
    const lastDay = new Date(endDate);
    if (lastDay < today) {
      return 'Expired';
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (lastDay.toDateString() === tomorrow.toDateString()) {
      return 'Last Day';
    }
    return 'Active';
  };

  if (queryLoading) return <CircularProgress />;
  if (queryError) return <p>Error loading job listings</p>;

  const filteredJobs = queryData?.getJobListingsByEmail || [];

  return (
    <ApolloProvider client={client}>
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ marginBottom: 3, color: '#333', textAlign: 'center' }}>
          {editingJob ? 'Edit Job Listing' : 'Create Job Listing'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Job Title"
            fullWidth
            margin="normal"
            variant="outlined"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            error={!!errors.jobTitle}
            helperText={errors.jobTitle}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={user ? user.email : email}
            InputProps={{ readOnly: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Company Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={!!errors.companyName}
            helperText={errors.companyName}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Job Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            error={!!errors.jobDescription}
            helperText={errors.jobDescription}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            error={!!errors.endDate}
            helperText={errors.endDate}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth margin="normal" sx={{ marginBottom: 2 }}>
            <InputLabel>Job Type</InputLabel>
            <Select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              label="Job Type"
            >
              <MenuItem value="Full-Time">Full-Time</MenuItem>
              <MenuItem value="Part-Time">Part-Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
            {editingJob ? 'Update Job Listing' : 'Create Job Listing'}
          </Button>
        </form>

        {editingJob && (
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => setEditingJob(null)}
          >
            Cancel Edit
          </Button>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={successMessage}
        />

        <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
          Job Listings
        </Typography>

        {filteredJobs.length === 0 ? (
          <Typography>No job listings found</Typography>
        ) : (
          <Grid container spacing={2}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Paper sx={{ padding: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {job.jobTitle}
                  </Typography>
                  <Typography>{job.companyName}</Typography>
                  <Typography>{job.jobDescription}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {getJobStatus(job.endDate)}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => setEditingJob(job)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(job.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </ApolloProvider>
  );
}
