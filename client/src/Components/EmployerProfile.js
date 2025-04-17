import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';

const CREATE_EMPLOYER_PROFILE = gql`
  mutation CreateEmployerProfile(
    $employerName: String!,
    $companyName: String!,
    $aboutCompany: String!,
    $companyStartDate: String!,
    $location: String!,
    $employerEmail: String!
  ) {
    createEmployerProfile(
      employerName: $employerName,
      companyName: $companyName,
      aboutCompany: $aboutCompany,
      companyStartDate: $companyStartDate,
      location: $location,
      employerEmail: $employerEmail
    ) {
      id
      employerName
      companyName
      aboutCompany
      companyStartDate
      location
      employerEmail
    }
  }
`;

const UPDATE_EMPLOYER_PROFILE = gql`
  mutation UpdateEmployerProfile(
    $id: ID!,
    $employerName: String!,
    $companyName: String!,
    $aboutCompany: String!,
    $companyStartDate: String!,
    $location: String!
  ) {
    updateEmployerProfile(
      id: $id,
      employerName: $employerName,
      companyName: $companyName,
      aboutCompany: $aboutCompany,
      companyStartDate: $companyStartDate,
      location: $location
    ) {
      id
      employerName
      companyName
      aboutCompany
      companyStartDate
      location
    }
  }
`;

const GET_EMPLOYER_PROFILE = gql`
  query GetEmployerProfile($email: String!) {
    getEmployerProfileByEmail(email: $email) {
      id
      employerName
      companyName
      aboutCompany
      companyStartDate
      location
      employerEmail
    }
  }
`;

export default function EmployerProfile() {
  const [employerName, setEmployerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const [companyStartDate, setCompanyStartDate] = useState('');
  const [location, setLocation] = useState('');
  const [employerEmail, setEmployerEmail] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [errors, setErrors] = useState({
    employerName: '',
    companyName: '',
    aboutCompany: '',
    companyStartDate: '',
    location: ''
  });

  const [createEmployerProfile] = useMutation(CREATE_EMPLOYER_PROFILE);
  const [updateEmployerProfile] = useMutation(UPDATE_EMPLOYER_PROFILE);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setEmployerEmail(user.email);
    }
  }, []);

  const { data, loading, error } = useQuery(GET_EMPLOYER_PROFILE, {
    variables: { email: employerEmail },
    skip: !employerEmail,
  });

  useEffect(() => {
    if (data && data.getEmployerProfileByEmail) {
      const profile = data.getEmployerProfileByEmail;
      setProfileId(profile.id);
      setEmployerName(profile.employerName);
      setCompanyName(profile.companyName);
      setAboutCompany(profile.aboutCompany);
      setCompanyStartDate(profile.companyStartDate);
      setLocation(profile.location);
      setIsProfileSaved(true);
    } else if (!data) {
      setIsProfileSaved(false);
    }
  }, [data]);

  const validateFields = () => {
    let valid = true;
    const newErrors = {
      employerName: '',
      companyName: '',
      aboutCompany: '',
      companyStartDate: '',
      location: ''
    };

    if (!employerName.trim()) {
      newErrors.employerName = 'Employer name is required';
      valid = false;
    }

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
      valid = false;
    }

    if (!aboutCompany.trim()) {
      newErrors.aboutCompany = 'About company is required';
      valid = false;
    }

    if (!companyStartDate) {
      newErrors.companyStartDate = 'Company start date is required';
      valid = false;
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const { data } = await createEmployerProfile({
        variables: {
          employerName,
          companyName,
          aboutCompany,
          companyStartDate,
          location,
          employerEmail,
        },
        refetchQueries: [{ query: GET_EMPLOYER_PROFILE, variables: { email: employerEmail } }],
      });
  
      if (data && data.createEmployerProfile) {
        alert('Profile saved successfully!');
        setProfileId(data.createEmployerProfile.id);
        setIsProfileSaved(true);
      } else {
        alert('Failed to save profile');
      }
    } catch (error) {
      alert('Error saving profile: ' + error.message);
    }
  };

  const handleUpdate = async () => {
    if (!validateFields()) return;

    try {
      const { data } = await updateEmployerProfile({
        variables: {
          id: profileId,
          employerName,
          companyName,
          aboutCompany,
          companyStartDate,
          location,
        },
        refetchQueries: [{ query: GET_EMPLOYER_PROFILE, variables: { email: employerEmail } }],
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  const renderButton = () => {
    if (loading) {
      return <Button variant="contained" disabled>Loading...</Button>;
    }

    if (!data || error) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ width: '100%', padding: '10px', borderRadius: '20px' }}
        >
          Add Information
        </Button>
      );
    }

    return isProfileSaved ? (
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ width: '100%', padding: '10px', borderRadius: '20px' }}
      >
        Update Profile
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ width: '100%', padding: '10px', borderRadius: '20px' }}
      >
        Save Profile
      </Button>
    );
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f1f1f1', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#0277bd', textAlign: 'center' }}>
        Manage Employer Profile
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper sx={{ padding: '20px', backgroundColor: '#fff', boxShadow: 3, borderRadius: '10px' }}>
            <Typography variant="h6" sx={{ marginBottom: '20px', color: '#0277bd' }}>
              Employer Information
            </Typography>
            <TextField
              fullWidth
              label="Employer Email"
              variant="outlined"
              value={employerEmail}
              InputProps={{
                readOnly: true,
              }}
              sx={{ marginBottom: '15px' }}
            />
            <TextField
              fullWidth
              label="Employer Name"
              variant="outlined"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              error={!!errors.employerName}
              helperText={errors.employerName}
              sx={{ marginBottom: '15px' }}
            />
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={!!errors.companyName}
              helperText={errors.companyName}
              sx={{ marginBottom: '15px' }}
            />
            <TextField
              fullWidth
              label="About Company"
              variant="outlined"
              multiline
              rows={4}
              value={aboutCompany}
              onChange={(e) => setAboutCompany(e.target.value)}
              error={!!errors.aboutCompany}
              helperText={errors.aboutCompany}
              sx={{ marginBottom: '15px' }}
            />
            <TextField
              fullWidth
              label="Company Start Date"
              variant="outlined"
              type="date"
              value={companyStartDate}
              onChange={(e) => setCompanyStartDate(e.target.value)}
              error={!!errors.companyStartDate}
              helperText={errors.companyStartDate}
              sx={{ marginBottom: '15px' }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              sx={{ marginBottom: '15px' }}
            />
            {renderButton()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}