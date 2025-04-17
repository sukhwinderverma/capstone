import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom'; 

export default function JobSeekerDashboard() {
  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f1f1f1', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#0277bd', textAlign: 'center' }}>
        Job Seeker Dashboard
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '30px', color: '#555', textAlign: 'center' }}>
        Welcome to your personalized dashboard. Here you can manage your job applications, explore job listings, and update your profile. Take the next step in your career today!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <Paper sx={{ padding: '20px', textAlign: 'center', boxShadow: 3, borderRadius: '10px', backgroundColor: '#fff', position: 'relative' }}>
            <img 
              src="https://static.vecteezy.com/system/resources/previews/021/730/528/large_2x/job-search-and-employment-front-view-of-hand-searching-for-job-opportunities-online-using-computer-new-vacancies-on-website-page-at-home-photo.jpg" 
              alt="Job Listings" 
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px' }} 
            />
            <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold', color: '#0277bd' }}>
              Explore Job Listings
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '15px', color: '#555' }}>
              Discover a wide range of job opportunities. Find positions that match your skills and preferences.
            </Typography>
            <Button variant="contained" color="primary" href="/job-listings" sx={{ borderRadius: '20px', padding: '10px 20px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
              View Listings
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper sx={{ padding: '20px', textAlign: 'center', boxShadow: 3, borderRadius: '10px', backgroundColor: '#fff', position: 'relative' }}>
            <img 
              src="https://atlas-content-cdn.pixelsquid.com/assets_v2/269/2691030914946831942/jpeg-600/G03.jpg?modifiedAt=1" 
              alt="Update Profile" 
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px' }} 
            />
            <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold', color: '#0277bd' }}>
              Update Your Profile
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '15px', color: '#555' }}>
              Make sure your profile is up to date. Highlight your skills and experiences to attract the best employers.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/update-profile"
              sx={{
                borderRadius: '20px',
                padding: '10px 20px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Update Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>

     
    </Box>
  );
}
