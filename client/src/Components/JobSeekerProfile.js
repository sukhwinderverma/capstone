import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  CircularProgress,
  FormHelperText,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function JobSeekerProfile() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [genre, setGenre] = useState('');
  const [address, setAddress] = useState('');
  const [nationality, setNationality] = useState('');
  const [languages, setLanguages] = useState('');
  const [experience, setExperience] = useState([{ startDate: '', endDate: '', jobTitle: '', companyName: '', description: '' }]);
  const [education, setEducation] = useState([{ startDate: '', endDate: '', institution: '', degree: '', description: '' }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    mobile: '',
    email: '',
    genre: '',
    address: '',
    nationality: '',
    languages: '',
    experienceDates: '',
    educationDates: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setEmail(savedUser.email);
      fetchUserProfile(savedUser.email);
    } else {
      setUser(null);
    }
  }, [navigate]);

  const validateFields = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      mobile: '',
      email: '',
      genre: '',
      address: '',
      nationality: '',
      languages: '',
      experienceDates: '',
      educationDates: ''
    };

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = 'Invalid mobile number. Enter 10 digit mobile no.';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!genre) {
      newErrors.genre = 'Gender is required';
      valid = false;
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    if (!nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
      valid = false;
    }

    if (!languages.trim()) {
      newErrors.languages = 'Languages are required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const fetchUserProfile = async (email) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4005/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              getJobSeekerProfileByEmail(email: "${email}") {
                id
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
                  startDate
                  endDate
                  institution
                  degree
                  description
                }
              }
            }
          `,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.errors) {
        setMessage(data.errors[0].message);
      } else {
        const profile = data.data.getJobSeekerProfileByEmail;
        setUser(profile);
        setFirstName(profile.name);
        setEmail(profile.email);
        setMobile(profile.mobile);
        setGenre(profile.gender);
        setAddress(profile.address);
        setNationality(profile.nationality);
        setLanguages(profile.languages);
        setExperience(profile.experience);
        setEducation(profile.education);
      }
    } catch (error) {
      setLoading(false);
      setMessage('Error fetching profile: ' + error.message);
    }
  };

  const handleSave = async () => {
    if (!validateFields() || !isValidExperienceDates() || !isValidEducationDates()) {
      setMessage('Please fix all validation errors');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      let query = '';
      const emailExistsResponse = await fetch('http://localhost:4005/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              getJobSeekerProfileByEmail(email: "${email}") {
                id
                email
              }
            }
          `,
        }),
      });

      const emailExistsData = await emailExistsResponse.json();

      if (emailExistsData.data && emailExistsData.data.getJobSeekerProfileByEmail) {
        const existingProfile = emailExistsData.data.getJobSeekerProfileByEmail;

        query = `
          mutation {
            updateJobSeekerProfile(
              id: "${existingProfile.id}",
              name: "${firstName}",
              email: "${email}",
              mobile: "${mobile}",
              gender: "${genre}",
              address: "${address}",
              nationality: "${nationality}",
              languages: "${languages}",
              experience: ${JSON.stringify(experience).replace(/\"([^(\")"]+)\":/g, '$1:')},
              education: ${JSON.stringify(education).replace(/\"([^(\")"]+)\":/g, '$1:')}
            ) {
              id
            }
          }
        `;
      } else {
        query = `
          mutation {
            createJobSeekerProfile(
              name: "${firstName}",
              email: "${email}",
              mobile: "${mobile}",
              gender: "${genre}",
              address: "${address}",
              nationality: "${nationality}",
              languages: "${languages}",
              experience: ${JSON.stringify(experience).replace(/\"([^(\")"]+)\":/g, '$1:')},
              education: ${JSON.stringify(education).replace(/\"([^(\")"]+)\":/g, '$1:')}
            ) {
              id
            }
          }
        `;
      }

      const response = await fetch("http://localhost:4005/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.errors) {
        setMessage(data.errors[0].message);
      } else {
        setMessage(user ? "Profile updated successfully!" : "Profile created successfully!");
        navigate("/job-seeker-dashboard");
      }
      setOpenSnackbar(true);
    } catch (error) {
      setLoading(false);
      setMessage('Error updating or creating profile: ' + error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleExperienceChange = (index, e) => {
    const updatedExperience = [...experience];
    updatedExperience[index][e.target.name] = e.target.value;
    setExperience(updatedExperience);
  };

  const handleEducationChange = (index, e) => {
    const updatedEducation = [...education];
    updatedEducation[index][e.target.name] = e.target.value;
    setEducation(updatedEducation);
  };

  const addExperience = () => {
    setExperience([...experience, { startDate: '', endDate: '', jobTitle: '', companyName: '', description: '' }]);
  };

  const addEducation = () => {
    setEducation([...education, { startDate: '', endDate: '', institution: '', degree: '', description: '' }]);
  };

  const removeExperience = (index) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(updatedExperience);
  };

  const removeEducation = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) <= today;
  };

  const isStartBeforeEnd = (start, end) => {
    if (!start || !end) return true;
    return new Date(start) <= new Date(end);
  };

  const isValidExperienceDates = () => {
    for (const exp of experience) {
      if (!isDateInPast(exp.startDate) || (exp.endDate && !isDateInPast(exp.endDate)) || !isStartBeforeEnd(exp.startDate, exp.endDate)) {
        setErrors((prevErrors) => ({ ...prevErrors, experienceDates: 'Experience dates must be valid and start must be before end.' }));
        return false;
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, experienceDates: '' }));
    return true;
  };

  const isValidEducationDates = () => {
    for (const edu of education) {
      if (!isDateInPast(edu.startDate) || (edu.endDate && !isDateInPast(edu.endDate)) || !isStartBeforeEnd(edu.startDate, edu.endDate)) {
        setErrors((prevErrors) => ({ ...prevErrors, educationDates: 'Education dates must be valid and start must be before end.' }));
        return false;
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, educationDates: '' }));
    return true;
  };

  useEffect(() => {
    isValidExperienceDates();
    isValidEducationDates();
  }, [experience, education]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>Job Seeker Profile</Typography>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={Boolean(errors.firstName)} helperText={errors.firstName} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} error={Boolean(errors.mobile)} helperText={errors.mobile} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={Boolean(errors.email)} helperText={errors.email} disabled sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={Boolean(errors.genre)} sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select value={genre} onChange={(e) => setGenre(e.target.value)} label="Gender">
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              <FormHelperText>{errors.genre}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Address" value={address} onChange={(e) => setAddress(e.target.value)} error={Boolean(errors.address)} helperText={errors.address} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} error={Boolean(errors.nationality)} helperText={errors.nationality} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Languages" value={languages} onChange={(e) => setLanguages(e.target.value)} error={Boolean(errors.languages)} helperText={errors.languages} sx={{ mb: 2 }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>Experience</Typography>
        {experience.map((exp, index) => (
          <Paper key={index} sx={{ p: 2, mb: 3 }} elevation={1}>
            <Typography variant="h6" gutterBottom>Experience {index + 1}</Typography>
            {['jobTitle', 'companyName', 'startDate', 'endDate', 'description'].map((field, i) => (
              <TextField
                key={i}
                fullWidth
                name={field}
                label={field.replace(/([A-Z])/g, ' $1')}
                value={exp[field]}
                onChange={(e) => handleExperienceChange(index, e)}
                type={field.includes('Date') ? 'date' : 'text'}
                InputLabelProps={field.includes('Date') ? { shrink: true } : undefined}
                sx={{ mb: 2 }}
                error={Boolean(errors.experienceDates)}
                helperText={field === 'jobTitle' && errors.experienceDates}
              />
            ))}
            <Button onClick={() => removeExperience(index)} color="error" size="small">Remove</Button>
          </Paper>
        ))}
        <Button onClick={addExperience} variant="outlined" color="secondary" sx={{ mb: 3 }}>Add Experience</Button>

        <Typography variant="h5" gutterBottom>Education</Typography>
        {education.map((edu, index) => (
          <Paper key={index} sx={{ p: 2, mb: 3 }} elevation={1}>
            <Typography variant="h6" gutterBottom>Education {index + 1}</Typography>
            {['institution', 'degree', 'startDate', 'endDate', 'description'].map((field, i) => (
              <TextField
                key={i}
                fullWidth
                name={field}
                label={field.replace(/([A-Z])/g, ' $1')}
                value={edu[field]}
                onChange={(e) => handleEducationChange(index, e)}
                type={field.includes('Date') ? 'date' : 'text'}
                InputLabelProps={field.includes('Date') ? { shrink: true } : undefined}
                sx={{ mb: 2 }}
                error={Boolean(errors.educationDates)}
                helperText={field === 'institution' && errors.educationDates}
              />
            ))}
            <Button onClick={() => removeEducation(index)} color="error" size="small">Remove</Button>
          </Paper>
        ))}
        <Button onClick={addEducation} variant="outlined" color="secondary" sx={{ mb: 3 }}>Add Education</Button>

        <Box sx={{ marginTop: 3, textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loading} size="large" sx={{ px: 5, py: 1.5 }}>
            {loading ? <CircularProgress size={24} /> : 'Save Profile'}
          </Button>
        </Box>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={message} />
    </Box>
  );
}
