import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Mail as MailIcon } from '@mui/icons-material';

const GET_JOB_APPLICATIONS = gql`
  query GetAllJobApplications {
    getAllJobApplications {
      id
      jobSeekerEmail
      employerEmail
      jobId
      appliedAt
      job {
        id
        jobTitle
        companyName
        jobDescription
        startDate
        endDate
        jobType
        email
        userId
      }
    }
  }
`;

const GET_JOB_SEEKER_PROFILE = gql`
  query GetJobSeekerProfile($email: String!) {
    getJobSeekerProfileByEmail(email: $email) {
      name
      email
      mobile
      gender
      address
      nationality
      languages
      experience {
        startDate
        endDate
        jobTitle
        companyName
        description
      }
      education {
        degree
        institution
        startDate
        endDate
        description
      }
    }
  }
`;

const DELETE_JOB_APPLICATION = gql`
  mutation DeleteJobApplication($id: ID!) {
    deleteJobApplication(id: $id) {
      success
      message
    }
  }
`;

const ViewApplications = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const employerEmail = user ? user.email : null;

  const {
    loading: appsLoading,
    error: appsError,
    data: appsData,
    refetch,
  } = useQuery(GET_JOB_APPLICATIONS);

  const [jobSeekerProfiles, setJobSeekerProfiles] = useState({});
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [deleteError, setDeleteError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const { refetch: refetchJobSeekerProfile } = useQuery(GET_JOB_SEEKER_PROFILE, {
    skip: true,
  });

  const [deleteJobApplication] = useMutation(DELETE_JOB_APPLICATION, {
    update(cache, { data }, { variables }) {
      const existingApplications = cache.readQuery({ query: GET_JOB_APPLICATIONS });

      if (!existingApplications) return;

      const newApplications = existingApplications.getAllJobApplications.filter(
        (application) => application.id !== variables.id
      );

      cache.writeQuery({
        query: GET_JOB_APPLICATIONS,
        data: { getAllJobApplications: newApplications },
      });
    },
    onCompleted(data) {
      if (data.deleteJobApplication.success) {
        setSnackbarMessage(data.deleteJobApplication.message);
      } else {
        setSnackbarMessage('Failed to delete application.');
      }
      setOpenSnackbar(true);
      refetch();
    },
    onError(error) {
      setDeleteError(error.message);
      setOpenSnackbar(true);
    },
  });

  useEffect(() => {
    if (appsData) {
      const jobSeekerEmails = [
        ...new Set(
          appsData.getAllJobApplications.map((application) =>
            application.jobSeekerEmail.trim().toLowerCase()
          )
        ),
      ];

      setLoadingProfiles(true);

      Promise.all(
        jobSeekerEmails.map((email) =>
          refetchJobSeekerProfile({ email }).then((response) => {
            return {
              email,
              profile: response.data.getJobSeekerProfileByEmail,
            };
          })
        )
      )
        .then((profiles) => {
          const profilesMap = profiles.reduce((acc, { email, profile }) => {
            acc[email] = profile;
            return acc;
          }, {});
          setJobSeekerProfiles(profilesMap);
          setLoadingProfiles(false);
        })
        .catch(() => {
          setLoadingProfiles(false);
        });
    }
  }, [appsData, refetchJobSeekerProfile]);

  const handleDeleteClick = (applicationId) => {
    setApplicationToDelete(applicationId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { data } = await deleteJobApplication({ variables: { id: applicationToDelete } });

      if (data && data.deleteJobApplication.success) {
        setSnackbarMessage(data.deleteJobApplication.message);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      const errorMessage = error.message || 'An error occurred during the deletion';
      
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err) => console.error(err.message));
      }
      
      setDeleteError(errorMessage);
      setSnackbarMessage('Failed to delete the application.');
      setOpenSnackbar(true);
    }
    setDeleteDialogOpen(false);
  };

  if (appsLoading || loadingProfiles) {
    return (
      <CircularProgress
        sx={{ display: 'block', margin: 'auto', marginTop: '20px' }}
      />
    );
  }

  if (appsError) {
    return (
      <Typography variant="h6" color="error" align="center">
        Error: {appsError.message}
      </Typography>
    );
  }

  const applications = appsData?.getAllJobApplications || [];
  const filteredApplications = applications
    .filter((application) => application.employerEmail === employerEmail)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  const handleAcceptClick = (jobSeekerEmail, jobTitle) => {
    const subject = `Job Application Response for ${jobTitle}`;
    const body = `Dear ${jobSeekerEmail},\n\nWe have reviewed your application for the position of ${jobTitle}. We would like to proceed further.\n\nBest regards,\nYour Company Name`;
    window.location.href = `mailto:${jobSeekerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#0277bd',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Job Applications
      </Typography>

      {filteredApplications.length === 0 ? (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ marginTop: '20px' }}
        >
          No job applications found for {employerEmail}.
        </Typography>
      ) : (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Applications for Employer: {employerEmail}
          </Typography>
          <List sx={{ padding: 0 }}>
            {filteredApplications.map((application) => {
              const normalizedEmail = application.jobSeekerEmail.trim().toLowerCase();
              const jobSeekerProfile = jobSeekerProfiles[normalizedEmail];

              return (
                <ListItem
                  key={application.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      maxWidth: 800,
                      boxShadow: 3,
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      padding: 2,
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ marginTop: 1 }}>
                        Job Seeker: {application.jobSeekerEmail}
                      </Typography>
                      <Divider sx={{ margin: '10px 0' }} />
                      <Typography variant="body2">
                        <strong>Employer Email:</strong> {application.employerEmail}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Job Title:</strong> {application.job?.jobTitle}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Company Name:</strong> {application.job?.companyName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Job Description:</strong> {application.job?.jobDescription}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Start Date:</strong> {application.job?.startDate}
                      </Typography>
                      <Typography variant="body2">
                        <strong>End Date:</strong> {application.job?.endDate}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Job Type:</strong> {application.job?.jobType}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Job Email:</strong> {application.job?.email}
                      </Typography>

                      {jobSeekerProfile ? (
                        <Box sx={{ marginTop: 2 }}>
                          <Typography variant="body2">
                            <strong>Name:</strong> {jobSeekerProfile.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Mobile:</strong> {jobSeekerProfile.mobile}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Gender:</strong> {jobSeekerProfile.gender}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Address:</strong> {jobSeekerProfile.address}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Nationality:</strong> {jobSeekerProfile.nationality}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Languages:</strong> {jobSeekerProfile.languages}
                          </Typography>
                          <Typography variant="h6" sx={{ mt: 2 }}>Experience</Typography>
                          {jobSeekerProfile.experience.map((exp, idx) => (
                            <Box key={idx}>
                              <Typography variant="body2"><strong>Job Title:</strong> {exp.jobTitle}</Typography>
                              <Typography variant="body2"><strong>Company Name:</strong> {exp.companyName}</Typography>
                              <Typography variant="body2"><strong>Duration:</strong> {exp.startDate} - {exp.endDate}</Typography>
                              <Typography variant="body2"><strong>Description:</strong> {exp.description}</Typography>
                              <Divider sx={{ margin: '10px 0' }} />
                            </Box>
                          ))}
                          <Typography variant="h6" sx={{ mt: 2 }}>Education</Typography>
                          {jobSeekerProfile.education.map((edu, idx) => (
                            <Box key={idx}>
                              <Typography variant="body2"><strong>Degree:</strong> {edu.degree}</Typography>
                              <Typography variant="body2"><strong>Institution:</strong> {edu.institution}</Typography>
                              <Typography variant="body2"><strong>Duration:</strong> {edu.startDate} - {edu.endDate}</Typography>
                              <Typography variant="body2"><strong>Description:</strong> {edu.description}</Typography>
                              <Divider sx={{ margin: '10px 0' }} />
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          ⚠️ No profile found for <strong>{application.jobSeekerEmail}</strong>.
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() =>
                          handleAcceptClick(application.jobSeekerEmail, application.job.jobTitle)
                        }
                      >
                        <MailIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleDeleteClick(application.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage || deleteError}
        autoHideDuration={6000}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this application?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewApplications;
